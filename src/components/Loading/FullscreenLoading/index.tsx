import { Center, Flexbox } from '@lobehub/ui';
import { type ReactNode } from 'react';
import React, { memo } from 'react';

import { ProductLogo } from '@/components/Branding';
import { type StageItem } from '@/components/InitProgress';
import InitProgress from '@/components/InitProgress';

interface FullscreenLoadingProps {
  activeStage: number;
  contentRender?: ReactNode;
  stages: StageItem[];
}

const FullscreenLoading = memo<FullscreenLoadingProps>(({ activeStage, stages, contentRender }) => {
  return null;
});

export default FullscreenLoading;
