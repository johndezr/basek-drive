import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/Table';
import { Button } from '@/components/ui/shadcn/Button';
import { Input } from '@/components/ui/shadcn/Input';
import { LoaderCircle } from 'lucide-react';
import type { File } from '@/domain/models/File';
import { useDebounce } from '@/hooks/useDebounce';

interface IndexedFilesTableProps {
  indexedFiles: File[];
  loadingFileId: string | null;
  handleUpload: (file: File) => void;
  handleRemoveIndex: (fileId: string) => void;
  removeJupyterFile: (fileName: string, fileId: string, parentFolderName: string) => void;
}

export default function IndexedFilesTable({
  indexedFiles,
  loadingFileId,
  handleUpload,
  handleRemoveIndex,
  removeJupyterFile,
}: IndexedFilesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  const filteredFiles = indexedFiles.filter((file) =>
    file.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="mb-4 w-1/3">
        <Input
          type="text"
          placeholder="Search file by name"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>mimeType</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Parent Folders</TableHead>
            <TableHead>File Size</TableHead>
            <TableHead>Jupyter</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map(
            (file) =>
              file.type === 'file' && (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.mimeType}</TableCell>
                  <TableCell>{file.createdTime}</TableCell>
                  <TableCell>{file.parentFolderName ? file.parentFolderName : '-'}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>
                    <Button
                      disabled={loadingFileId === file.id}
                      onClick={() =>
                        file.indexed
                          ? removeJupyterFile(file.name, file.id, file.parentFolderName)
                          : handleUpload(file)
                      }
                      variant="secondary"
                    >
                      {loadingFileId === file.id && (
                        <LoaderCircle className="h-6 w-6 animate-spin" />
                      )}
                      {loadingFileId === file.id
                        ? 'Indexing...'
                        : file.indexed
                          ? 'Desindex'
                          : 'Index'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={loadingFileId === file.id}
                      onClick={() => handleRemoveIndex(file.id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
    </>
  );
}
