import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/shadcn/Dialog';
import { Button } from '@/components/ui/shadcn/Button';
import FileListData from '@/components/modules/FileListData';
import FileTreeSkeleton from '@/components/ui/FileTreeSkeleton';
import { Suspense } from 'react';
import type { File } from '@/domain/models/File';

interface FileSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  selectedItems: string[];
  onSelectedItemsChange: (ids: string[]) => void;
  onIndex: () => void;
}

export default function FileSelectionDialog({
  open,
  onOpenChange,
  files,
  selectedItems,
  onSelectedItemsChange,
  onIndex,
}: FileSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Archivos disponibles</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<FileTreeSkeleton />}>
          {open && (
            <FileListData
              onSelectedItemsChange={onSelectedItemsChange}
              selectedItems={selectedItems}
              files={files}
            />
          )}
        </Suspense>
        <DialogFooter>
          <Button disabled={!selectedItems.length} onClick={onIndex}>
            Index
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
