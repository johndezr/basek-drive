//TODO: Make an extension of this type for the Google Drive API

export type File = {
  id: string;
  name: string;
  createdTime: string;
  mimeType: string;
  size: number | string | null;
  parents?: string[];
  children?: File[];
  type: 'file' | 'folder';
  indexed?: boolean;
  parentId?: string;
};
