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

export const downloadFileFromDrive = async (fileId: string) => {
  if (!fileId) throw new Error('No fileId provided');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/drive/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    return response.json();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadFileToJupyter = async (formData: FormData) => {
  if (!formData) throw new Error('No formData provided');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upload-jupyter`, {
      method: 'POST',
      body: formData,
    });

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeFileFromJupyter = async (filename: string) => {
  if (!filename) throw new Error('No filename provided');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/delete-jupyter`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename }),
    });

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};
