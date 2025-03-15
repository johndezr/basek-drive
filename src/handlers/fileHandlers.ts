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
    toast.info('Todos los archivos seleccionados ya están indexados');
    return;
  }

  const updatedFiles = [...indexedFiles, ...newFiles];
  updateLocalStorageFiles(updatedFiles);
  setIndexedFiles(updatedFiles);

  setDialogOpen(false);
  toast.success(`${newFiles.length} archivos seleccionados para indexar`);
};

export const handleRemoveIndex = (
  fileId: string,
  indexedFiles: File[],
  setIndexedFiles: (files: File[]) => void,
) => {
  const updatedFiles = indexedFiles.filter((file) => file.id !== fileId);
  updateLocalStorageFiles(updatedFiles);
  setIndexedFiles(updatedFiles);
  toast.success('Archivo desindexado correctamente');
};

export const removeJupyterFile = async (
  fileName: string,
  setLoadingFileId: (fileId: string | null) => void,
  fileId: string,
  setIndexedFiles: (files: File[]) => void,
) => {
  try {
    setLoadingFileId(fileId);
    const response = await removeFileFromJupyter(fileName);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Jupyter:', errorText);
      toast.error('Error al eliminar el archivo');
      return;
    }

    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const fileIndex = files.findIndex((file: File) => file.id === fileId);
    if (fileIndex !== -1) {
      delete files[fileIndex].indexed;
      localStorage.setItem('files', JSON.stringify(files));
    }
    setIndexedFiles(files);

    toast.success('Archivo eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    toast.error('Error al eliminar el archivo');
    return;
  } finally {
    setLoadingFileId(null);
  }
};

export const handleJupyterUpload = async (
  fileId: string,
  setLoadingFileId: (fileId: string | null) => void,
  setIndexedFiles: (files: File[]) => void,
) => {
  if (!fileId) return;
  setLoadingFileId(fileId);

  const driveData = await downloadFileFromDrive(fileId);
  if (driveData.error) {
    setLoadingFileId(null);
    return;
  }

  const fileContent = atob(driveData.fileContent);
  const fileName = driveData.fileName;

  const formData = new FormData();
  formData.append('file', new Blob([fileContent], { type: driveData.mimeType }), fileName);

  try {
    const response = await uploadFileToJupyter(formData);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Jupyter:', errorText);
      toast.error('Error al subir el archivo');
      setLoadingFileId(null);
      return;
    }

    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const fileIndex = files.findIndex((file: File) => file.id === fileId);
    if (fileIndex !== -1) {
      files[fileIndex].indexed = true;
      localStorage.setItem('files', JSON.stringify(files));
    }
    setIndexedFiles(files);
    toast.success('Archivo indexado correctamente');
    setLoadingFileId(null);
  } catch (error) {
    setLoadingFileId(null);
    console.error('Error al subir el archivo:', error);
    toast.error('Error al subir el archivo');
    return;
  }
};
