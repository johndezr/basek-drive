import React, { Suspense } from 'react';
import { fetchUserFiles } from '@/services/file';
import FileList from '@/components/modules/FileList';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { QUERY_KEYS } from '@/config/constants';

export default async function FilesPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')!.value;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.USER_FILES, userId],
    queryFn: () => fetchUserFiles(token),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Cargando archivos...</p>}>
        <FileList userId={userId} token={token} />
      </Suspense>
    </HydrationBoundary>
  );
}
