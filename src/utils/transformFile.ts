import type { File } from '@/domain/models/File';
import { FOLDER_MIME_TYPE } from '@/config/constants';

export const transformFile = (files: File[]) => {
  const itemMap = {} as Record<string, File>;
  const rootItems = [] as File[];

  // Crear todos los nodos
  files.forEach((file: File) => {
    const isFolder = file.mimeType === FOLDER_MIME_TYPE;
    const item = {
      id: file.id,
      name: file.name,
      createdTime: file.createdTime,
      mimeType: file.mimeType,
      size: file.size,
      type: isFolder ? 'folder' : 'file',
      children: isFolder ? [] : undefined,
    } as File;
    itemMap[file.id] = item;
  });

  // Establecer relaciones padre-hijo
  files.forEach((file: File) => {
    const item = itemMap[file.id];
    if (file.parents && file.parents.length > 0) {
      const parentId = file.parents[0];
      const parent = itemMap[parentId];
      if (parent && parent.children) {
        item.parentId = parentId;
        parent.children.push(item);
      } else {
        rootItems.push(item);
      }
    } else {
      rootItems.push(item);
    }
  });

  return rootItems;
};
