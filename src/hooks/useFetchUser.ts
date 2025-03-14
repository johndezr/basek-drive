import { QUERY_KEYS } from '@/config/constants';
import { fetchUserInfo } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useFetchUser = (token: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: () => fetchUserInfo(token),
    enabled: !!token,
  });
};
