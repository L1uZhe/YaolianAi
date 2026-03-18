import { ENABLE_BUSINESS_FEATURES } from '@lobechat/business-const';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';

import BrowserSTT from './browser';
import OpenaiSTT from './openai';

const STT = memo<{ mobile?: boolean }>(({ mobile }) => {
  return null;
});

export default STT;
