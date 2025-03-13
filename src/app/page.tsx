import ConnectGdButton from '@/components/ui/ConnectGoogleDrive';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Home() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_APP_CLIENT_ID!}>
      <ConnectGdButton />
    </GoogleOAuthProvider>
  );
}
