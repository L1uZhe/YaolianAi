import { Button } from '@lobehub/ui';
import { ShapesUploadIcon } from '@lobehub/ui/icons';
import { Popconfirm } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from '@/components/AntdStaticMethods';
import { useMarketAuth } from '@/layout/AuthProvider/MarketAuth';
import { resolveMarketAuthError } from '@/layout/AuthProvider/MarketAuth/errors';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

import { useVersionReviewStatus } from '../AgentVersionReviewTag';
import ForkConfirmModal from './ForkConfirmModal';
import type { MarketPublishAction } from './types';
import { type OriginalAgentInfo, useMarketPublish } from './useMarketPublish';

interface MarketPublishButtonProps {
  action: MarketPublishAction;
  onPublishSuccess?: (identifier: string) => void;
}

const PublishButton = memo<MarketPublishButtonProps>(({ action, onPublishSuccess }) => {
  return null;
});

PublishButton.displayName = 'MarketPublishButton';

export default PublishButton;
