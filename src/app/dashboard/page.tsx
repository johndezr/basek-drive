import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { getQueryClient } from '@/lib/reactQueryClient';
import FilePage from '@/components/pages/FilePage';
import { QUERY_KEYS } from '@/config/constants';
import { fetchUserInfo } from '@/services/user';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')!.value;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: () => fetchUserInfo(token),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilePage token={token} />
    </HydrationBoundary>
  );
}
