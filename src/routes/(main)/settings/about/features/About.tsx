'use client';

import { SiDiscord, SiGithub, SiRss, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { BRANDING_EMAIL, BRANDING_NAME, SOCIAL_URL } from '@lobechat/business-const';
import { Flexbox, Form } from '@lobehub/ui';
import { Divider } from 'antd';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { BLOG, mailTo,OFFICIAL_SITE, PRIVACY_URL, TERMS_URL } from '@/const/url';

import AboutList from './AboutList';
import ItemCard from './ItemCard';
import ItemLink from './ItemLink';
import Version from './Version';

const styles = createStaticStyles(({ css, cssVar }) => ({
  title: css`
    font-size: 14px;
    font-weight: bold;
    color: ${cssVar.colorTextSecondary};
  `,
}));

const About = memo<{ mobile?: boolean }>(({ mobile }) => {
  const { t } = useTranslation('common');

  return (
    <Form.Group
      collapsible={false}
      gap={16}
      style={{ maxWidth: '1024px', width: '100%' }}
      title={`关于 ${BRANDING_NAME}`}
      variant={'filled'}
    >
      <Flexbox gap={20} paddingBlock={20} width={'100%'}>
        <div className={styles.title} style={{ fontSize: '19px', fontWeight: 'bold' }}>当前版本</div>
        <Version mobile={mobile} />
      </Flexbox>
    </Form.Group>
  );
});

export default About;
