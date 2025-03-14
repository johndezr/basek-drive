import { QUERY_KEYS } from '@/config/constants';
import { fetchUserFiles } from '@/services/file';
import { useSuspenseQuery } from '@tanstack/react-query';
import FileList from '@/components/modules/FileList';

export default function FileListData({ token }: { token: string }) {
  const { data: files } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.USER_FILES],
    queryFn: () => fetchUserFiles(token),
  });

  return <FileList files={files || []} />;
}
