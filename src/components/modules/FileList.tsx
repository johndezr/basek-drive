'use client';

import type { File } from '@/domain/models/File';
import FileTree from '@/components/ui/FileTree';
import { useState } from 'react';

// Función para encontrar un elemento por ID en la estructura de datos
// const findItemById = (data: File[], id: string): File | null => {
//   for (const item of data) {
//     if (item.id === id) return item;
//     if (item.children) {
//       const found = findItemById(item.children, id);
//       if (found) return found;
//     }
//   }
//   return null;
// };

const getAllIds = (item: File): string[] => {
  if (!item) return [];
  const ids = [item.id];
  if (item.children) {
    item.children.forEach((child: File) => {
      ids.push(...getAllIds(child));
    });
  }
  return ids;
};

export default function FileList({ files }: { files: File[] }) {
  // Usamos un array de strings para almacenar solo los IDs seleccionados
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (item: File, isChecked: boolean) => {
    if (isChecked) {
      // Agregar el elemento y todos sus hijos
      const idsToAdd = getAllIds(item);
      setSelectedIds((prev) => [...new Set([...prev, ...idsToAdd])]);
    } else {
      // Eliminar el elemento y todos sus hijos
      const idsToRemove = new Set(getAllIds(item));
      setSelectedIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
    }
  };

  // Convertimos los IDs seleccionados a objetos para mostrarlos en el JSON
  // const selectedItems = selectedIds
  //   .map((id) => {
  //     const item = findItemById(files, id);
  //     return item ? { id: item.id, name: item.name, type: item.type } : null;
  //   })
  //   .filter(Boolean);

  return (
    <div>
      {files?.length > 0 && (
        <FileTree files={files} selectedItems={selectedIds} onToggle={toggleSelection} />
      )}
    </div>
  );
}
