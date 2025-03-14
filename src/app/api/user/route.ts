import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const token = headersList.get('AccessToken');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_API_URL}/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    cookieStore.set('accessToken', token, { secure: true });
    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
