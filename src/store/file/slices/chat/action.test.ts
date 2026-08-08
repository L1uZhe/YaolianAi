import { act, renderHook } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { documentService } from '@/services/document';
import { fileService } from '@/services/file';

import { useFileStore as useStore } from '../../store';

vi.mock('zustand/traditional');

// Mock necessary modules and functions
vi.mock('@/components/AntdStaticMethods', () => ({
  notification: {
    error: vi.fn(),
  },
}));

beforeAll(() => {
  Object.defineProperty(File.prototype, 'arrayBuffer', {
    writable: true,
    value: function () {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsArrayBuffer(this);
      });
    },
  });
});

beforeEach(() => {
  vi.restoreAllMocks();

  vi.spyOn(documentService, 'getDocumentById').mockResolvedValue({
    fileId: 'real-file-id',
  } as any);
  vi.spyOn(fileService, 'removeFile').mockResolvedValue();
});

describe('useFileStore:chat', () => {
  it('clearChatUploadFileList should clear the inputFilesList', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      useStore.setState({ chatUploadFileList: [{ id: 'abc' }] as any });
    });

    expect(result.current.chatUploadFileList).toEqual([{ id: 'abc' }]);

    act(() => {
      result.current.clearChatUploadFileList();
    });

    expect(result.current.chatUploadFileList).toEqual([]);
  });

  it('attachChatFiles should add remote file as a success item', async () => {
    const { result } = renderHook(() => useStore());
    const fileItem = {
      fileType: 'application/pdf',
      id: 'file-1',
      name: 'a.pdf',
      size: 100,
      sourceType: 'file',
      url: 'https://cdn.example.com/a/file-1',
    } as any;

    await act(async () => {
      await result.current.attachChatFiles([fileItem]);
    });

    expect(result.current.chatUploadFileList).toHaveLength(1);
    expect(result.current.chatUploadFileList[0]).toMatchObject({
      fileUrl: 'https://cdn.example.com/a/file-1',
      id: 'file-1',
      isRemote: true,
      previewUrl: 'https://cdn.example.com/a/file-1',
      status: 'success',
    });
    expect(result.current.chatUploadFileList[0].file).toMatchObject({
      name: 'a.pdf',
      size: 100,
      type: 'application/pdf',
    });
  });

  it('attachChatFiles should skip duplicates', async () => {
    const { result } = renderHook(() => useStore());
    const fileItem = {
      fileType: 'application/pdf',
      id: 'file-1',
      name: 'a.pdf',
      size: 100,
      sourceType: 'file',
      url: 'https://cdn.example.com/a/file-1',
    } as any;

    await act(async () => {
      await result.current.attachChatFiles([fileItem]);
      await result.current.attachChatFiles([fileItem]);
    });

    expect(result.current.chatUploadFileList).toHaveLength(1);
  });

  it('attachChatFiles should resolve docs_* ids to the real file id', async () => {
    const { result } = renderHook(() => useStore());
    const fileItem = {
      fileType: 'application/pdf',
      id: 'docs_1',
      name: 'a.pdf',
      size: 100,
      sourceType: 'file',
      url: 'https://cdn.example.com/a/docs_1',
    } as any;

    await act(async () => {
      await result.current.attachChatFiles([fileItem]);
    });

    expect(documentService.getDocumentById).toHaveBeenCalledWith('docs_1');
    expect(result.current.chatUploadFileList[0]).toMatchObject({
      fileUrl: 'https://cdn.example.com/a/real-file-id',
      id: 'real-file-id',
      isRemote: true,
    });
  });

  it('removeChatUploadFile should not delete remote files', async () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      useStore.setState({ chatUploadFileList: [{ id: 'file-1', isRemote: true }] as any });
    });

    await act(async () => {
      await result.current.removeChatUploadFile('file-1');
    });

    expect(result.current.chatUploadFileList).toEqual([]);
    expect(fileService.removeFile).not.toHaveBeenCalled();
  });

  it('removeChatUploadFile should delete local files', async () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      useStore.setState({ chatUploadFileList: [{ id: 'file-1', isRemote: false }] as any });
    });

    await act(async () => {
      await result.current.removeChatUploadFile('file-1');
    });

    expect(result.current.chatUploadFileList).toEqual([]);
    expect(fileService.removeFile).toHaveBeenCalledWith('file-1');
  });
});
