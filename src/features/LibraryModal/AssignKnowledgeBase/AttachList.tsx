import { Button, Center, Empty, Flexbox, Icon, Skeleton, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { ArrowLeft, ChevronRight, LibraryBig } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FileIcon from '@/components/FileIcon';
import RepoIcon from '@/components/LibIcon';
import { useFileStore } from '@/store/file';
import { useKnowledgeBaseStore } from '@/store/library';
import { type FileListItem } from '@/types/files';

interface AttachListProps {
  onClose: () => void;
}

interface LibrarySelection {
  id: string;
  name: string;
}

interface FolderPathItem {
  id: string;
  name: string;
}

const styles = createStaticStyles(({ css, cssVar }) => ({
  row: css`
    cursor: pointer;
    border-radius: 8px;
    transition: background ${cssVar.motionDurationFast};

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }
  `,
  scroll: css`
    overflow: auto;
    min-height: 0;
  `,
}));

const LibraryFileList = memo<{
  library: LibrarySelection;
  onBack: () => void;
  onClose: () => void;
}>(({ library, onBack, onClose }) => {
  const { t } = useTranslation('chat');
  const [path, setPath] = useState<FolderPathItem[]>([]);
  const [useFetchKnowledgeItems, attachChatFiles] = useFileStore((s) => [
    s.useFetchKnowledgeItems,
    s.attachChatFiles,
  ]);

  const parentId = path.at(-1)?.id ?? null;
  const { data, isLoading } = useFetchKnowledgeItems({
    knowledgeBaseId: library.id,
    parentId,
    showFilesInKnowledgeBase: false,
  });

  const items = (data || []).sort((a, b) => {
    if (a.fileType === 'custom/folder' && b.fileType !== 'custom/folder') return -1;
    if (a.fileType !== 'custom/folder' && b.fileType === 'custom/folder') return 1;
    return a.name.localeCompare(b.name);
  });

  const handleBack = () => {
    if (path.length > 0) {
      setPath((prev) => prev.slice(0, -1));
    } else {
      onBack();
    }
  };

  const handleAttach = async (item: FileListItem) => {
    await attachChatFiles([item]);
    onClose();
  };

  return (
    <Flexbox height={500}>
      <Flexbox horizontal align={'center'} gap={8} padding={16} style={{ paddingBottom: 8 }}>
        <Button
          icon={<Icon icon={ArrowLeft} />}
          size={'small'}
          type={'text'}
          onClick={handleBack}
        >
          {t('knowledgeBase.attach.back')}
        </Button>
        <Flexbox
          horizontal
          align={'center'}
          flex={1}
          gap={6}
          style={{ minWidth: 0, overflow: 'hidden' }}
        >
          <Text ellipsis style={{ flexShrink: 0, fontSize: 13, fontWeight: 500 }}>
            {library.name}
          </Text>
          {path.map((folder, index) => (
            <Flexbox
              horizontal
              align={'center'}
              flex={1}
              gap={6}
              key={folder.id}
              style={{ minWidth: 0 }}
            >
              <Text style={{ color: 'inherit', flexShrink: 0, fontSize: 13 }}>/</Text>
              <Text ellipsis style={{ fontSize: 13, minWidth: 0 }}>
                {folder.name}
              </Text>
              {index === path.length - 1 ? null : <Icon icon={ChevronRight} size={12} />}
            </Flexbox>
          ))}
        </Flexbox>
      </Flexbox>
      <Flexbox className={styles.scroll} flex={1} paddingInline={12}>
        {isLoading ? (
          <Flexbox padding={16}>
            <Skeleton paragraph={{ rows: 7 }} title={false} />
          </Flexbox>
        ) : items.length === 0 ? (
          <Center gap={12} height={'100%'} padding={40}>
            <Empty
              description={t('knowledgeBase.attach.empty')}
              descriptionProps={{ fontSize: 14 }}
              icon={LibraryBig}
            />
          </Center>
        ) : (
          items.map((item) => {
            const isFolder = item.fileType === 'custom/folder';
            return (
              <Flexbox
                align={'center'}
                className={styles.row}
                gap={12}
                key={item.id}
                paddingBlock={10}
                paddingInline={12}
                onClick={() => {
                  if (isFolder) {
                    setPath((prev) => [...prev, { id: item.id, name: item.name }]);
                  } else {
                    handleAttach(item);
                  }
                }}
              >
                <FileIcon
                  fileName={item.name}
                  fileType={item.fileType}
                  isDirectory={isFolder}
                  size={40}
                />
                <Text ellipsis style={{ flex: 1, fontSize: 14, minWidth: 0 }}>
                  {item.name}
                </Text>
                <Icon icon={ChevronRight} size={16} />
              </Flexbox>
            );
          })
        )}
      </Flexbox>
    </Flexbox>
  );
});

LibraryFileList.displayName = 'LibraryFileList';

const AttachList = memo<AttachListProps>(({ onClose }) => {
  const { t } = useTranslation('chat');
  const [library, setLibrary] = useState<LibrarySelection | null>(null);
  const [useFetchKnowledgeBaseList] = useKnowledgeBaseStore((s) => [s.useFetchKnowledgeBaseList]);
  const { data: libraries, isLoading } = useFetchKnowledgeBaseList();

  if (library) {
    return <LibraryFileList library={library} onBack={() => setLibrary(null)} onClose={onClose} />;
  }

  return (
    <Flexbox height={500}>
      <Flexbox paddingBlock={12} paddingInline={16}>
        <Text style={{ fontSize: 13, fontWeight: 500 }}>
          {t('knowledgeBase.attach.libraries')}
        </Text>
      </Flexbox>
      <Flexbox className={styles.scroll} flex={1} paddingInline={12}>
        {isLoading ? (
          <Flexbox padding={16}>
            <Skeleton paragraph={{ rows: 7 }} title={false} />
          </Flexbox>
        ) : !libraries || libraries.length === 0 ? (
          <Center gap={12} height={'100%'} padding={40}>
            <Empty
              description={t('knowledgeBase.attach.empty')}
              descriptionProps={{ fontSize: 14 }}
              icon={LibraryBig}
            />
          </Center>
        ) : (
          libraries.map((item) => (
            <Flexbox
              align={'center'}
              className={styles.row}
              gap={12}
              key={item.id}
              paddingBlock={10}
              paddingInline={12}
              onClick={() => setLibrary({ id: item.id, name: item.name })}
            >
              <RepoIcon size={32} />
              <Text ellipsis style={{ flex: 1, fontSize: 14, minWidth: 0 }}>
                {item.name}
              </Text>
              <Icon icon={ChevronRight} size={16} />
            </Flexbox>
          ))
        )}
      </Flexbox>
    </Flexbox>
  );
});

AttachList.displayName = 'AttachList';

export default AttachList;
