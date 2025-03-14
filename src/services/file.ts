import type { File } from '@/domain/models/File';

export const fetchUserFiles = async (token: string): Promise<File[]> => {
  if (!token) throw new Error('No token provided');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/drive`, {
      headers: {
        AccessToken: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user files');
    }

    return response.json() as Promise<File[]>;
  } catch (error) {
    return Promise.reject(error);
  }
};
