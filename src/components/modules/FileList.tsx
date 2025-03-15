'use client';

import type { File } from '@/domain/models/File';
import FileTree from '@/components/ui/FileTree';

export default function FileList({
  files,
  toggleSelection,
  selectedIds,
}: {
  files: File[];
  toggleSelection: (item: File, isChecked: boolean) => void;
  selectedIds: string[];
}) {
  return (
    <div>
      {files?.length > 0 && (
        <FileTree files={files} selectedItems={selectedIds} onToggle={toggleSelection} />
      )}
    </div>
  );
}
