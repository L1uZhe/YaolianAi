'use client';

import { ActionIcon, DropdownMenu } from '@lobehub/ui';
import { BotIcon, MoreHorizontal } from 'lucide-react';
import { memo,Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import GroupBlock from '../components/GroupBlock';
import GroupSkeleton from '../components/GroupSkeleton';
import ScrollShadowWithButton from '../components/ScrollShadowWithButton';
import { RECENT_BLOCK_SIZE } from '../const';
import CommunityAgentsList from './List';

const CommunityAgents = memo(() => {
  return null;
});

export default CommunityAgents;
