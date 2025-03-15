'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/Card';
import { Button } from '@/components/ui/shadcn/Button';
import { Separator } from '@/components/ui/shadcn/Separator';
import UserData from '@/components/modules/UserData';
import UserSkeleton from '@/components/ui/UserSkeleton';
import FileTreeSkeleton from '@/components/ui/FileTreeSkeleton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/config/constants';
import { fetchUserFiles } from '@/services/file';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { File } from '@/domain/models/File';
import IndexedFilesTable from '@/components/modules/IndexedFilesTable';
import FileSelectionDialog from '@/components/modules/FileSelectionDialog';

export default function FileMain({ token }: { token: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [indexedFiles, setIndexedFiles] = useState<File[]>([]);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar archivos indexados desde localStorage
    const storedFiles = localStorage.getItem('files');
    if (storedFiles) {
      setIndexedFiles(JSON.parse(storedFiles));
    }
  }, []);

  const { data: files, isLoading } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.USER_FILES],
    queryFn: () => fetchUserFiles(token),
  });

  const logOut = () => {
    document.cookie = `accessToken=; path=/; max-age=0; SameSite=Lax`;
    router.push(`/`);
  };

  const handleIndex = () => {
    toast.success(`${selectedItems.length} archivos seleccionados para indexar`);
    const folesFormated = getSelectedFiles();
    setIndexedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...folesFormated];
      localStorage.setItem('files', JSON.stringify(updatedFiles));
      return updatedFiles;
    });
    setDialogOpen(false);
  };

  const getSelectedFiles = (): File[] => {
    if (!files) return [];

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

  const handleUpload = async (fileId: string) => {
    if (!fileId) return;
    setLoadingFileId(fileId);

    const driveResponse = await fetch('/api/drive/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    const driveData = await driveResponse.json();
    if (driveData.error) {
      console.log(driveData.error);
      setLoadingFileId(null);
      return;
    }

    const fileContent = atob(driveData.fileContent);
    const fileName = driveData.fileName;

    const formData = new FormData();
    formData.append('file', new Blob([fileContent], { type: driveData.mimeType }), fileName);

    try {
      const response = await fetch('/api/upload-jupyter', {
        method: 'POST',
        body: formData,
      });

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

  return (
    <>
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Suspense fallback={<UserSkeleton />}>
                <UserData token={token} />
              </Suspense>
              <Button className="ml-auto" variant="secondary" onClick={() => setDialogOpen(true)}>
                Indexar archivos
              </Button>
              <Button onClick={logOut} className="ml-auto">
                Cerrar sesion
              </Button>
            </div>
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {isLoading ? (
            <FileTreeSkeleton />
          ) : indexedFiles.length > 0 ? (
            <IndexedFilesTable
              indexedFiles={indexedFiles}
              loadingFileId={loadingFileId}
              handleUpload={handleUpload}
            />
          ) : (
            <p className="text-center text-xl text-gray-500">No hay archivos indexados aún.</p>
          )}
        </CardContent>
      </Card>
      <FileSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        files={files || []}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        onIndex={handleIndex}
      />
    </>
  );
}
