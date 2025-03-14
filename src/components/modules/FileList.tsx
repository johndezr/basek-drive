'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserFiles } from '@/services/file';
import type { File } from '@/app/domain/models/File';
import { QUERY_KEYS } from '@/config/constants';
import FileTree from '@/components/ui/FileTree';
import { useState } from 'react';

// // Función para encontrar un elemento por ID en la estructura de datos
// const findItemById = (data: DriveItem[], id: string): DriveItem | null => {
//   for (const item of data) {
//     if (item.id === id) return item;
//     if (item.children) {
//       const found = findItemById(item.children, id);
//       if (found) return found;
//     }
//   }
//   return null;
// };

export default function FileList({ token, userId }: { token: string; userId: string }) {
  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_FILES, userId],
    queryFn: () => fetchUserFiles(token),
  });
  // Usamos un array de strings para almacenar solo los IDs seleccionados
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (isLoading) return <p>Cargando archivos...</p>;
  if (error) return <p>Error al cargar archivos</p>;
  if (!files) return <p>No tienes archivos aún creados.</p>;

  const toggleSelection = (item: File, isChecked: boolean) => {
    const getAllIds = (item: File): string[] => {
      if (!item) return [];
      const ids = [item.id];
      if (item.children) {
        item.children.forEach((child) => {
          ids.push(...getAllIds(child));
        });
      }
      return ids;
    };
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

  // // Convertimos los IDs seleccionados a objetos para mostrarlos en el JSON
  // const selectedItems = selectedIds
  //   .map((id) => {
  //     const item = findItemById(files, id);
  //     return item ? { id: item.id, name: item.name, type: item.type } : null;
  //   })
  //   .filter(Boolean);

  return (
    <div>
      {files?.length > 0 ? (
        <div>
          <FileTree files={files} selectedItems={selectedIds} onToggle={toggleSelection} />
          <div>
            <h3>Elementos seleccionados:</h3>
            {/* <pre>{JSON.stringify(selectedItems, null, 2)}</pre> */}
            <pre>{JSON.stringify(files, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <p>No hay archivos disponibles.</p>
      )}
    </div>
  );
}
