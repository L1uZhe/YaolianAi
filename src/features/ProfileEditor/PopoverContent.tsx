import { type ItemType } from '@lobehub/ui';
import { Flexbox, Icon, Segmented, stopPropagation } from '@lobehub/ui';
import { createStaticStyles, cssVar } from 'antd-style';
import { ChevronRight, ExternalLink, Settings, Store } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ToolsList, { toolsListStyles } from '@/features/ChatInput/ActionBar/Tools/ToolsList';

import Empty from './Empty';

type TabType = 'all' | 'installed';

const SKILL_ICON_SIZE = 20;

const styles = createStaticStyles(({ css }) => ({
  footer: css`
    padding: 4px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  header: css`
    padding: ${cssVar.paddingXS};
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    background: transparent;
  `,
  scroller: css`
    overflow: hidden auto;
  `,
  trailingIcon: css`
    opacity: 0.5;
  `,
}));

interface PopoverContentProps {
  activeTab: TabType;
  allTabItems: ItemType[];
  installedTabItems: ItemType[];
  onClose?: () => void;
  onOpenStore: () => void;
  onTabChange: (tab: TabType) => void;
}

const PopoverContent = memo<PopoverContentProps>(
  ({ activeTab, onTabChange, allTabItems, installedTabItems, onOpenStore, onClose }) => {
    const { t } = useTranslation('setting');
    const navigate = useNavigate();

    const currentItems = activeTab === 'all' ? allTabItems : installedTabItems;

    return (
      <Flexbox style={{ maxHeight: 500, width: '100%' }}>
        {/* stopPropagation prevents dropdown's onClick from calling preventDefault on Segmented */}
        <div className={styles.header} onClick={stopPropagation}>
          <Segmented
            block
            size="small"
            value={activeTab}
            options={[
              {
                label: t('tools.tabs.all', { defaultValue: 'All' }),
                value: 'all',
              },
              {
                label: t('tools.tabs.installed', { defaultValue: 'Installed' }),
                value: 'installed',
              },
            ]}
            onChange={(v) => onTabChange(v as TabType)}
          />
        </div>
        <div className={styles.scroller} style={{ flex: 1 }}>
          {activeTab === 'installed' && installedTabItems.length === 0 ? (
            <Empty />
          ) : (
            <ToolsList items={currentItems} />
          )}
        </div>
      </Flexbox>
    );
  },
);

PopoverContent.displayName = 'PopoverContent';

export default PopoverContent;
