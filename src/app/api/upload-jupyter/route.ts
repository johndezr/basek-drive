import { NextResponse } from 'next/server';

const JUPYTER_API_URL = `${process.env.NEXT_PUBLIC_JUPYTER_URL}/api/contents`;
const JUPYTER_TOKEN = process.env.NEXT_PUBLIC_JUPYTER_TOKEN;

async function folderExists(folderPath: string) {
  const res = await fetch(`${JUPYTER_API_URL}/${folderPath}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${JUPYTER_TOKEN}`,
    },
  });
  return res.ok;
}

async function createFolder(folderPath: string) {
  await fetch(`${JUPYTER_API_URL}/${folderPath}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${JUPYTER_TOKEN}`,
    },
    body: JSON.stringify({ type: 'directory' }),
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const fileName = formData.get('fileName') as string;
  const parentFolderName = formData.get('parentFolderName') as string;
  let filePath = fileName;

  if (parentFolderName) {
    const folderNames = parentFolderName.split('/').filter(Boolean);
    let currentPath = '';

    for (const folder of folderNames) {
      if (currentPath) currentPath += '/';
      currentPath += folder;
      if (!(await folderExists(currentPath))) {
        await createFolder(currentPath);
      }
      filePath = `${currentPath}/${fileName}`;
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const response = await fetch(`${JUPYTER_API_URL}/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${JUPYTER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: buffer.toString('base64'),
        format: 'base64',
        type: 'file',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ message: 'Failed to upload to Jupyter', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to upload to Jupyter', error }, { status: 500 });
  }
}
