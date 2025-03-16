import FileList from '@/components/modules/FileList';
import type { File } from '@/domain/models/File';
import { getAllIds } from '@/utils/fileUtils';

export default function FileListData({
  selectedItems,
  onSelectedItemsChange,
  files,
}: {
  selectedItems: string[];
  onSelectedItemsChange: (ids: string[]) => void;
  files: File[];
}) {
  const toggleSelection = (item: File, isChecked: boolean) => {
    if (isChecked) {
      // Agregar el elemento y todos sus hijos
      const idsToAdd = getAllIds(item);
      onSelectedItemsChange([...new Set([...selectedItems, ...idsToAdd])]);
    } else {
      // Eliminar el elemento y todos sus hijos
      const idsToRemove = new Set(getAllIds(item));
      onSelectedItemsChange(selectedItems.filter((id: string) => !idsToRemove.has(id)));
    }
  };

  return <FileList selectedIds={selectedItems} toggleSelection={toggleSelection} files={files} />;
}
