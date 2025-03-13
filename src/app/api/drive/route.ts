import { google } from 'googleapis';
import { headers } from 'next/headers';
import { DRIVE_VERSION, DRIVE_PAGE_SIZE, DRIVE_FIELDS } from '../../../config/constants';

export async function GET() {
  const headersList = await headers();
  const token = headersList.get('AccessToken');

  if (!token) return Response.json({ error: 'No token provided' }, { status: 401 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    const drive = google.drive({ version: DRIVE_VERSION, auth });
    const response = await drive.files.list({
      pageSize: DRIVE_PAGE_SIZE,
      fields: DRIVE_FIELDS,
    });
    return Response.json(response.data.files);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return Response.json({ error: 'Error al obtener archivos de Google Drive' }, { status: 500 });
  }
}
