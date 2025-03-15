import { QUERY_KEYS } from '@/config/constants';
import { User } from '@/domain/models/User';
import { fetchUserInfo } from '@/services/user';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function UserData({ token }: { token: string }) {
  const { data: user } = useSuspenseQuery<User>({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: () => fetchUserInfo(token),
  });

  return (
    <>
      <Avatar>
        <AvatarImage className="w-10 rounded-4xl" src={`${user.picture}?.jpg`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span>{user.name}</span>
    </>
  );
}
