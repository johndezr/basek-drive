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
      parentFolderName: '',
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

  // Construir las rutas completas para cada elemento
  const buildParentPath = (item: File): string => {
    if (!item.parentId) {
      return '';
    }

    const parent = itemMap[item.parentId];
    if (!parent) {
      return '';
    }

    const parentPath = buildParentPath(parent);
    return parentPath ? `${parentPath}/${parent.name}` : `/${parent.name}`;
  };

  // Asignar las rutas de carpetas a cada elemento
  Object.values(itemMap).forEach((item) => {
    item.parentFolderName = buildParentPath(item);
  });

  return rootItems;
};
