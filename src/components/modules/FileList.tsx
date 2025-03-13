'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserFiles } from '@/services/file';
import type { File } from '@/app/domain/models/File';
import { QUERY_KEYS } from '@/config/constants';

export default function FileList({ token, userId }: { token: string; userId: string }) {
  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_FILES, userId],
    queryFn: () => fetchUserFiles(token),
  });

  if (isLoading) return <p>Cargando archivos...</p>;
  if (error) return <p>Error al cargar archivos</p>;
  if (!files) return <p>No tienes archivos aún creados.</p>;

  return (
    <div>
      {files?.length > 0 ? (
        <ul>
          {files.map((file: File) => (
            <li key={file.id}>
              <strong>{file.name}</strong> ({file.size} bytes)
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay archivos disponibles.</p>
      )}
    </div>
  );
}
