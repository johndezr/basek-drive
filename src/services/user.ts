import type { User } from '@/domain/models/User';

export const fetchUserInfo = async (token: string): Promise<User> => {
  if (!token) throw new Error('No token found');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
      headers: {
        AccessToken: token,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user info');

    return response.json() as Promise<User>;
  } catch (error) {
    return Promise.reject(error);
  }
};
