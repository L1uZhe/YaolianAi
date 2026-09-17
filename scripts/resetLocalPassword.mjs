#!/usr/bin/env node
/**
 * 重置本地 LobeHub 账号密码（better-auth credential 账号）
 *
 * 用法：
 *   node scripts/resetLocalPassword.mjs --email <邮箱> --password <新密码> [--db <DATABASE_URL>] [--dry-run]
 *
 * 说明：
 *   - 直接复用 better-auth 自带的 hashPassword，确保哈希格式与登录校验完全一致
 *     （scrypt, N=16384, r=16, p=1, dkLen=64，存储格式 "salt:key"）
 *   - 写入前会把旧哈希备份到 .password-backup-<时间戳>.json，可回滚
 *   - 写入后会重新从数据库读回并校验一次
 */
import fs from 'node:fs';
import path from 'node:path';

import { hashPassword, verifyPassword } from 'better-auth/crypto';
import pg from 'pg';

const argv = process.argv.slice(2);
const getArg = (name, short) => {
  const i = argv.findIndex((a) => a === `--${name}` || (short && a === `-${short}`));
  return i === -1 ? undefined : argv[i + 1];
};
const hasFlag = (name) => argv.includes(`--${name}`);

const email = getArg('email', 'e');
const newPassword = getArg('password', 'p');
let databaseUrl = getArg('db');
const dryRun = hasFlag('dry-run');

if (!email || !newPassword) {
  console.error(
    '用法: node scripts/resetLocalPassword.mjs --email <邮箱> --password <新密码> [--dry-run]',
  );
  process.exit(1);
}

if (newPassword.length < 8 && !hasFlag('allow-weak')) {
  console.error('❌ 新密码至少 8 位。确实要用弱密码请显式加 --allow-weak（仅建议本地开发）');
  process.exit(1);
}
if (newPassword.length < 8) {
  console.warn('⚠️  已放行弱密码（--allow-weak）。若该实例曾通过公网隧道暴露，请务必改掉。');
}

// 从 .env.local 读取 DATABASE_URL
if (!databaseUrl) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ 未找到 .env.local，请用 --db 显式传入 DATABASE_URL');
    process.exit(1);
  }
  const line = fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith('DATABASE_URL='));
  if (!line) {
    console.error('❌ .env.local 中没有 DATABASE_URL');
    process.exit(1);
  }
  databaseUrl = line
    .slice(line.indexOf('=') + 1)
    .trim()
    .replaceAll(/^["']|["']$/g, '');
}

const main = async () => {
  // 1. 生成新哈希（直接用 better-auth 的实现）
  const nextHash = await hashPassword(newPassword);

  // 2. 自校验：确认生成的哈希能被 better-auth 自己的校验函数通过
  const selfCheck = await verifyPassword({ hash: nextHash, password: newPassword });
  const wrongRejected = !(await verifyPassword({ hash: nextHash, password: newPassword + '_x' }));
  if (!selfCheck || !wrongRejected) {
    console.error('❌ 哈希自校验失败，已中止（未改动数据库）');
    process.exit(1);
  }
  console.log('✅ 哈希自校验通过（正向通过 / 错误密码拒绝）');

  const client = new pg.Client({ connectionString: databaseUrl, connectionTimeoutMillis: 20000 });
  await client.connect();

  try {
    // 3. 定位目标账号
    const found = await client.query(
      `select a.id, a.user_id, a.provider_id, a.password, a.account_id, u.email
         from accounts a
         join users u on u.id = a.user_id
        where lower(u.email) = lower($1) and a.provider_id = 'credential'`,
      [email],
    );

    if (found.rowCount === 0) {
      console.error(`❌ 未找到 credential 账号: ${email}`);
      const all = await client.query('select email from users order by created_at');
      console.error('现有账号: ' + all.rows.map((r) => r.email).join(', '));
      process.exitCode = 1;
      return;
    }
    if (found.rowCount > 1) {
      console.error(
        `❌ 匹配到 ${found.rowCount} 条 credential 记录，请人工确认后用 account id 处理`,
      );
      process.exitCode = 1;
      return;
    }

    const target = found.rows[0];
    console.log(`目标账号: ${target.email} (user_id=${target.user_id}, account_id=${target.id})`);

    if (dryRun) {
      console.log('🔍 dry-run 模式，未写入数据库');
      return;
    }

    // 4. 备份旧哈希
    const backupPath = path.resolve(process.cwd(), `.password-backup-${Date.now()}.json`);
    fs.writeFileSync(
      backupPath,
      JSON.stringify(
        { email: target.email, accountId: target.id, oldPasswordHash: target.password },
        null,
        2,
      ),
      'utf8',
    );
    console.log(`💾 旧哈希已备份: ${path.basename(backupPath)}`);

    // 5. 写入新哈希
    const upd = await client.query(
      `update accounts set password = $1, updated_at = now()
        where id = $2 and provider_id = 'credential'`,
      [nextHash, target.id],
    );
    if (upd.rowCount !== 1) {
      console.error('❌ 更新影响行数异常: ' + upd.rowCount);
      process.exitCode = 1;
      return;
    }

    // 6. 从数据库读回并校验
    const after = await client.query('select password from accounts where id = $1', [target.id]);
    const ok = await verifyPassword({ hash: after.rows[0].password, password: newPassword });
    console.log(ok ? '✅ 写入后回读校验通过，新密码已生效' : '❌ 回读校验失败');
    if (!ok) process.exitCode = 1;

    // 7. 清理该账号的旧会话（强制重新登录）
    const sess = await client.query('delete from auth_sessions where user_id = $1', [
      target.user_id,
    ]);
    console.log(`🧹 已清理 ${sess.rowCount} 条旧会话`);
  } finally {
    await client.end();
  }
};

main().catch((e) => {
  console.error('❌ 执行失败:', e.message);
  process.exit(1);
});
