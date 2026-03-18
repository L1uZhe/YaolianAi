import { Block, Button, Flexbox, Tag } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';

import { ProductLogo } from '@/components/Branding';
import { CURRENT_VERSION } from '@/const/version';

const styles = createStaticStyles(({ css, cssVar }) => ({
  logo: css`
    border-radius: calc(${cssVar.borderRadiusLG} * 2);
  `,
}));

const Version = memo<{ mobile?: boolean }>(({ mobile }) => {
  return (
    <Flexbox
      align={mobile ? 'stretch' : 'center'}
      gap={16}
      horizontal={!mobile}
      justify={'space-between'}
      width={'100%'}
    >
      <Flexbox horizontal align={'center'} flex={'none'} gap={16}>
        <ProductLogo size={64} />
        <Flexbox align={'flex-start'} gap={6}>
          <div style={{ fontSize: 18, fontWeight: 'bolder' }}>关于曜莲信息</div>
          <Tag>v{CURRENT_VERSION}</Tag>
        </Flexbox>
      </Flexbox>
      <Flexbox horizontal flex={mobile ? 1 : undefined} gap={8}>
        <a href="https://www.baidu.com" rel="noreferrer" style={{ flex: 1 }} target="_blank">
          <Button block={mobile}>官网</Button>
        </a>
      </Flexbox>
    </Flexbox>
  );
});

export default Version;
