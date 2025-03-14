export type File = {
  id: string;
  name: string;
  createdTime: string;
  mimeType: string;
  size: number | string | null;
  parents?: string[];
  children?: File[];
  type: 'file' | 'folder';
};
