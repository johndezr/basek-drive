'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Button } from '@/components/ui/shadcdn/Button';
import { useRouter } from 'next/navigation';
import { fetchUserInfo } from '@/services/user';
import type { User } from '@/app/domain/models/User';

const ConnectGdButton = () => {
  interface ErrorResponse {
    error?: string;
    error_description?: string;
    error_uri?: string;
  }

  const [error, setError] = useState<ErrorResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      fetchUserInfo(tokenResponse.access_token).then((user) => {
        setUser(user);
        router.push(`/files/${user.sub}`);
      });
    },
    onError: (err) => setError(err),
    scope: `${process.env.NEXT_PUBLIC_GOOGLE_API_URL}/auth/drive.readonly`,
    flow: 'implicit',
  });

  return (
    <div>
      <Button onClick={() => login()}>Conectar con Google Drive</Button>
      {user && <p>Conectado como: {user.name}</p>}
      {error && <p>Error al conectar: {error.error}</p>}
    </div>
  );
};

export default ConnectGdButton;
