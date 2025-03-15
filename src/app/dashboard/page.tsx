import React from 'react';
import { fetchUserFiles } from '@/services/file';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { QUERY_KEYS } from '@/config/constants';
import { getQueryClient } from '@/lib/reactQueryClient';
import FilePage from '@/components/pages/FilePage';
import { fetchUserInfo } from '@/services/user';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')!.value;

  const queryClient = getQueryClient();

  Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.USER_FILES],
      queryFn: () => fetchUserFiles(token),
    }),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.USER_INFO],
      queryFn: () => fetchUserInfo(token),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilePage token={token} />
    </HydrationBoundary>
  );
}
