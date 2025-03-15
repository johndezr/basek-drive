import { google } from 'googleapis';
import { headers } from 'next/headers';
import { DRIVE_VERSION, DRIVE_PAGE_SIZE, DRIVE_FIELDS } from '@/config/constants';
import { transformFile } from '@/utils/transformFile';
import type { File } from '@/domain/models/File';

export async function GET() {
  const headersList = await headers();
  const token = headersList.get('AccessToken');

  if (!token) return Response.json({ error: 'No token provided' }, { status: 401 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    const drive = google.drive({ version: DRIVE_VERSION, auth });
    const query = `
      trashed = false AND (
        mimeType = 'application/pdf' OR
        mimeType = 'application/json' OR
        mimeType = 'application/javascript' OR
        mimeType = 'application/typescript' OR
        mimeType = 'text/plain' OR
        mimeType = 'text/markdown' OR
        mimeType = 'text/html' OR
        mimeType = 'text/css' OR
        mimeType = 'text/x-python' OR
        mimeType = 'application/x-ipynb+json' OR
        mimeType CONTAINS 'image/' OR
        name contains '.js' OR
        name contains '.ts' OR
        name contains '.jsx' OR
        name contains '.tsx' OR
        name contains '.md' OR
        name contains '.markdown' OR
        name contains '.txt' OR
        name contains '.html' OR
        name contains '.htm' OR
        name contains '.css' OR
        name contains '.scss' OR
        name contains '.less' OR
        name contains '.json' OR
        name contains '.py' OR
        name contains '.ipynb' OR
        name contains '.xml' OR
        name contains '.yaml' OR
        name contains '.yml' OR
        name contains '.csv' OR
        name contains '.sql' OR
        name contains '.java' OR
        name contains '.c' OR
        name contains '.cpp' OR
        name contains '.h' OR
        name contains '.go' OR
        name contains '.rs' OR
        name contains '.rb' OR
        name contains '.php' OR
        name contains '.swift'
      )
    `
      .replace(/\s+/g, ' ')
      .trim();

    const response = await drive.files.list({
      pageSize: DRIVE_PAGE_SIZE,
      fields: DRIVE_FIELDS,
      orderBy: 'createdTime desc',
      q: query,
    });

    const files = response.data.files as File[];
    const fileTreeData = transformFile(files);

    return Response.json(fileTreeData);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return Response.json({ error: 'Error al obtener archivos de Google Drive' }, { status: 500 });
  }
}
