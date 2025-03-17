import { toast } from 'sonner';
import { getSelectedFiles, updateLocalStorageFiles } from '@/utils/fileUtils';
import { downloadFileFromDrive, uploadFileToJupyter, removeFileFromJupyter } from '@/services/file';
import type { File } from '@/domain/models/File';

export const handleIndex = (
  files: File[],
  selectedItems: string[],
  indexedFiles: File[],
  setIndexedFiles: (files: File[]) => void,
  setDialogOpen: (open: boolean) => void,
) => {
  const selectedFiles = getSelectedFiles(files, selectedItems);
  const newFiles = selectedFiles.filter(
    (file) => !indexedFiles.some((indexedFile) => indexedFile.id === file.id),
  );

  if (newFiles.length === 0) {
    toast.info('All selected files are already indexed');
    return;
  }

  const updatedFiles = [...indexedFiles, ...newFiles];

  updateLocalStorageFiles(updatedFiles);
  setIndexedFiles(updatedFiles);

  setDialogOpen(false);
  toast.success(`Files selected for indexing`);
};

export const handleRemoveIndex = (
  fileId: string,
  indexedFiles: File[],
  setIndexedFiles: (files: File[]) => void,
) => {
  const updatedFiles = indexedFiles.filter((file) => file.id !== fileId);
  updateLocalStorageFiles(updatedFiles);
  setIndexedFiles(updatedFiles);
  toast.success('File successfully deindexed');
};

export const removeJupyterFile = async (
  fileName: string,
  setLoadingFileId: (fileId: string | null) => void,
  fileId: string,
  parentFolderName: string,
  setIndexedFiles: (files: File[]) => void,
) => {
  try {
    setLoadingFileId(fileId);
    const response = await removeFileFromJupyter(fileName, parentFolderName);

    if (!response.ok) {
      await response.text();
      toast.error('Error deleting file');
      return;
    }

    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const fileIndex = files.findIndex((file: File) => file.id === fileId);
    if (fileIndex !== -1) {
      delete files[fileIndex].indexed;
      localStorage.setItem('files', JSON.stringify(files));
    }
    setIndexedFiles(files);

    toast.success('File successfully deleted');
  } catch (error) {
    toast.error('Error al eliminar el archivo');
    throw error;
  } finally {
    setLoadingFileId(null);
  }
};

export const handleJupyterUpload = async (
  file: File,
  setLoadingFileId: (fileId: string | null) => void,
  setIndexedFiles: (files: File[]) => void,
) => {
  if (!file.id) return;
  setLoadingFileId(file.id);

  const driveData = await downloadFileFromDrive(file.id);
  if (driveData.error) {
    setLoadingFileId(null);
    return;
  }

  const fileContent = atob(driveData.fileContent);
  const fileName = driveData.fileName;
  const content = new Blob([fileContent], { type: driveData.mimeType });

  const formData = new FormData();
  formData.append('file', content, fileName);
  formData.append('fileName', fileName);
  formData.append('parentFolderName', file.parentFolderName);

  try {
    const response = await uploadFileToJupyter(formData);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Respuesta de error de Jupyter:', errorText);
      toast.error('Error uploading file');
      setLoadingFileId(null);
      return;
    }

    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const fileIndex = files.findIndex((f: File) => f.id === file.id);
    if (fileIndex !== -1) {
      files[fileIndex].indexed = true;
      localStorage.setItem('files', JSON.stringify(files));
    }
    setIndexedFiles(files);
    toast.success('File indexed correctly');
    setLoadingFileId(null);
  } catch (error) {
    setLoadingFileId(null);
    toast.error('Error uploading the file: ' + error);
  }
};
