import { google } from 'googleapis';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { DRIVE_VERSION } from '@/config/constants';

export async function POST(req: NextRequest) {
  const { fileId } = await req.json();
  const cookieStore = await cookies();

  const token = cookieStore.get('accessToken')?.value;

  if (!token) return Response.json({ error: 'No token provided' }, { status: 401 });
  if (!fileId) return Response.json({ error: 'No file ID provided' }, { status: 400 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    const drive = google.drive({ version: DRIVE_VERSION, auth });

    const fileMetadata = await drive.files.get({
      fileId,
      fields: 'name,mimeType',
    });

    const fileName = fileMetadata.data.name;
    const mimeType = fileMetadata.data.mimeType;
    const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      response.data.on('data', (chunk) => chunks.push(chunk));
      response.data.on('end', () => resolve(Buffer.concat(chunks)));
      response.data.on('error', reject);
    });

    return Response.json({
      fileContent: fileBuffer.toString('base64'),
      fileName,
      mimeType,
    });
  } catch (error) {
    console.error('Error al obtener el archivo:', error);
    return Response.json({ error: 'Error al obtener el archivo de Google Drive' }, { status: 500 });
  }
}
