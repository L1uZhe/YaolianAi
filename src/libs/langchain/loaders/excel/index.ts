import { loadExcelFromBuffer } from '@lobechat/file-loaders/excel';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { loaderConfig } from '../config';

export const ExcelLoader = async (content: Uint8Array) => {
  const splitter = new RecursiveCharacterTextSplitter(loaderConfig);
  const pages = loadExcelFromBuffer(content);

  return await splitter.createDocuments(
    pages.map((page) => page.pageContent),
    pages.map((page) => page.metadata),
  );
};
