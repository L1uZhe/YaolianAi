import { Flexbox, Modal } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServerConfigStore } from '@/store/serverConfig';

import AttachList from './AttachList';
import List from './List';

interface AttachKnowledgeModalProps {
  mode?: 'assign' | 'attach';
  open?: boolean;
  setOpen: (open: boolean) => void;
}

export const AttachKnowledgeModal = memo<AttachKnowledgeModalProps>(
  ({ mode = 'assign', setOpen, open }) => {
    const { t } = useTranslation('chat');
    const mobile = useServerConfigStore((s) => s.isMobile);

    return (
      <Modal
        allowFullscreen
        footer={null}
        open={open}
        styles={{ body: { overflow: 'hidden' } }}
        title={
          mode === 'attach'
            ? t('knowledgeBase.attach.title')
            : t('knowledgeBase.library.title')
        }
        width={600}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Flexbox
          gap={mobile ? 8 : 16}
          style={{ maxHeight: mobile ? '-webkit-fill-available' : 'inherit' }}
          width={'100%'}
        >
          {mode === 'attach' ? (
            <AttachList
              onClose={() => {
                setOpen(false);
              }}
            />
          ) : (
            <List />
          )}
        </Flexbox>
      </Modal>
    );
  },
);
