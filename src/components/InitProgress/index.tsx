import { Center, Flexbox, Icon, Text } from '@lobehub/ui';
import { Progress } from 'antd';
import { cssVar } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

export interface StageObjectItem {
  icon?: ReactNode;
  text: string;
}
export type StageItem = string | StageObjectItem;

interface InitingProps {
  activeStage: number;
  stages: StageItem[];
}

const InitProgress = memo<InitingProps>(({ activeStage, stages }) => {
  return null;
});

export default InitProgress;
