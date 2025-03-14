'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Button } from '@/components/ui/shadcn/Button';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const ConnectGdButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        document.cookie = `accessToken=${tokenResponse.access_token}; path=/; max-age=3600; SameSite=Lax`;
        router.push(`/dashboard`);
      } catch (error) {
        setLoading(false);
        toast.error('Error al obtener la información del usuario');
        throw error;
      }
    },
    onError: () => {
      setLoading(false);
      toast.error('Error al conectar tu cuenta de Google');
    },
    onNonOAuthError: () => {
      setLoading(false);
      toast.error(
        'Popup window is failed to open or closed before an OAuth response is returned. Please, try again.',
      );
    },
    scope: `${process.env.NEXT_PUBLIC_GOOGLE_API_URL}/auth/drive.readonly`,
    flow: 'implicit',
  });

  return (
    <div>
      <Button
        onClick={() => {
          setLoading(true);
          login();
        }}
        disabled={loading}
      >
        {loading && <LoaderCircle className="h-6 w-6 animate-spin" />}
        Conectar con Google Drive
      </Button>
    </div>
  );
};

export default ConnectGdButton;
