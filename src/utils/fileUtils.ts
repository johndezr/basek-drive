import type { File } from '@/domain/models/File';

export const getSelectedFiles = (files: File[], selectedItems: string[]): File[] => {
  const findItemById = (data: File[], id: string): File | null => {
    for (const item of data) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  return selectedItems.map((id) => findItemById(files, id)).filter(Boolean) as File[];
};

export const updateLocalStorageFiles = (files: File[]) => {
  localStorage.setItem('files', JSON.stringify(files));
};

export const loadIndexedFilesFromLocalStorage = (): File[] => {
  const storedFiles = localStorage.getItem('files');
  return storedFiles ? JSON.parse(storedFiles) : [];
};

export const getAllIds = (item: File): string[] => {
  if (!item) return [];
  const ids = [item.id];
  if (item.children) {
    item.children.forEach((child: File) => {
      ids.push(...getAllIds(child));
    });
  }
  return ids;
};
