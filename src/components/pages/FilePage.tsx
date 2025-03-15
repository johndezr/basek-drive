'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/Card';
import { Button } from '@/components/ui/shadcn/Button';
import { Separator } from '@/components/ui/shadcn/Separator';
import UserData from '@/components/modules/UserData';
import UserSkeleton from '@/components/ui/UserSkeleton';
import FileTreeSkeleton from '@/components/ui/FileTreeSkeleton';
import { useRouter } from 'next/navigation';
import { QUERY_KEYS } from '@/config/constants';
import { fetchUserFiles } from '@/services/file';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { File } from '@/domain/models/File';
import IndexedFilesTable from '@/components/modules/IndexedFilesTable';
import FileSelectionDialog from '@/components/modules/FileSelectionDialog';
import { loadIndexedFilesFromLocalStorage } from '@/utils/fileUtils';
import { handleIndex, handleRemoveIndex, handleUpload } from '@/handlers/fileHandlers';

export default function FileMain({ token }: { token: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [indexedFiles, setIndexedFiles] = useState<File[]>([]);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIndexedFiles(loadIndexedFilesFromLocalStorage());
  }, []);

  const { data: files, isLoading } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.USER_FILES],
    queryFn: () => fetchUserFiles(token),
  });

  const logOut = () => {
    document.cookie = `accessToken=; path=/; max-age=0; SameSite=Lax`;
    router.push(`/`);
  };

  const openDialogAndCheckFilesAlreadyIndexed = () => {
    if (!files) return;
    const updatedFiles = files.map((file) => ({
      ...file,
      disabled: indexedFiles.some((indexedFile) => indexedFile.id === file.id),
    }));
    const alreadyIndexedIds = updatedFiles.filter((file) => file.disabled).map((file) => file.id);
    setSelectedItems(alreadyIndexedIds);
    setDialogOpen(true);
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
              <Button
                className="ml-auto"
                variant="secondary"
                onClick={openDialogAndCheckFilesAlreadyIndexed}
              >
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
              handleUpload={(fileId) => handleUpload(fileId, setLoadingFileId, setIndexedFiles)}
              handleRemoveIndex={(fileId) =>
                handleRemoveIndex(fileId, indexedFiles, setIndexedFiles)
              }
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
        onIndex={() =>
          handleIndex(files || [], selectedItems, indexedFiles, setIndexedFiles, setDialogOpen)
        }
      />
    </>
  );
}
