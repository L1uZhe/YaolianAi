import { KeyEnum } from '@lobechat/types';
import { combineKeys,Flexbox, Hotkey } from '@lobehub/ui';
import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useUserStore } from '@/store/user';
import { preferenceSelectors } from '@/store/user/selectors';

const Placeholder = memo(() => {
  return null;
});

export default Placeholder;
