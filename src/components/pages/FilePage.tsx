'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/Card';
import { Button } from '@/components/ui/shadcn/Button';
import { Separator } from '@/components/ui/shadcn/Separator';
import UserData from '@/components/modules/UserData';
import UserSkeleton from '@/components/ui/UserSkeleton';
import { useRouter } from 'next/navigation';
import { QUERY_KEYS } from '@/config/constants';
import { fetchUserFiles } from '@/services/file';
import { useQuery } from '@tanstack/react-query';
import type { File } from '@/domain/models/File';
import IndexedFilesTable from '@/components/modules/IndexedFilesTable';
import FileSelectionDialog from '@/components/modules/FileSelectionDialog';
import { loadIndexedFilesFromLocalStorage } from '@/utils/fileUtils';
import {
  handleIndex,
  handleRemoveIndex,
  handleJupyterUpload,
  removeJupyterFile,
} from '@/handlers/fileHandlers';

export default function FileMain({ token }: { token: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [indexedFiles, setIndexedFiles] = useState<File[]>([]);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const [fetchFiles, setFetchFiles] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIndexedFiles(loadIndexedFilesFromLocalStorage());
  }, []);

  const { data: files, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_FILES],
    queryFn: () => fetchUserFiles(token),
    enabled: fetchFiles,
  });

  const logOut = () => {
    document.cookie = `accessToken=; path=/; max-age=0; SameSite=Lax`;
    router.push(`/`);
  };

  const openDialogAndCheckFilesAlreadyIndexed = () => {
    setFetchFiles(true);
    if (files) {
      const updatedFiles = files.map((file) => ({
        ...file,
        disabled: indexedFiles.some((indexedFile) => indexedFile.id === file.id),
      }));
      const alreadyIndexedIds = updatedFiles.filter((file) => file.disabled).map((file) => file.id);
      setSelectedItems(alreadyIndexedIds);
    }
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
                Index Files
              </Button>
              <Button onClick={logOut} className="ml-auto">
                Logout
              </Button>
            </div>
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {indexedFiles.length > 0 ? (
            <IndexedFilesTable
              indexedFiles={indexedFiles}
              loadingFileId={loadingFileId}
              handleUpload={(file) => handleJupyterUpload(file, setLoadingFileId, setIndexedFiles)}
              removeJupyterFile={(fileName, fileId, parentFolderName) =>
                removeJupyterFile(
                  fileName,
                  setLoadingFileId,
                  fileId,
                  parentFolderName,
                  setIndexedFiles,
                )
              }
              handleRemoveIndex={(fileId) =>
                handleRemoveIndex(fileId, indexedFiles, setIndexedFiles)
              }
            />
          ) : (
            <p className="text-center text-xl text-gray-500">No files are indexed yet.</p>
          )}
        </CardContent>
      </Card>
      <FileSelectionDialog
        isLoading={isLoading}
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
