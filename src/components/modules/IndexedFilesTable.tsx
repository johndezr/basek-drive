import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/Table';
import { Button } from '@/components/ui/shadcn/Button';
import { LoaderCircle } from 'lucide-react';
import type { File } from '@/domain/models/File';

interface IndexedFilesTableProps {
  indexedFiles: File[];
  loadingFileId: string | null;
  handleUpload: (fileId: string) => void;
}

export default function IndexedFilesTable({
  indexedFiles,
  loadingFileId,
  handleUpload,
}: IndexedFilesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>mimeType</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>File Size</TableHead>
          <TableHead>Jupyter</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {indexedFiles.map((file) => (
          <TableRow key={file.id}>
            <TableCell>{file.name}</TableCell>
            <TableCell>{file.mimeType}</TableCell>
            <TableCell>{file.createdTime}</TableCell>
            <TableCell>{file.size}</TableCell>
            <TableCell>
              <Button
                disabled={loadingFileId === file.id}
                onClick={() => handleUpload(file.id)}
                variant="secondary"
              >
                {loadingFileId === file.id && <LoaderCircle className="h-6 w-6 animate-spin" />}
                {loadingFileId === file.id
                  ? 'Indexando...'
                  : file.indexed
                    ? 'Desindexar'
                    : 'Indexar'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
