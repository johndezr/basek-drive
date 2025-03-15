import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const JUPYTER_API_URL = `${process.env.NEXT_PUBLIC_JUPYTER_URL}/api/contents/base-knowledge/${file.name}`;
  const JUPYTER_TOKEN = process.env.NEXT_PUBLIC_JUPYTER_TOKEN;

  try {
    const response = await fetch(JUPYTER_API_URL, {
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
      const errorText = await response.text();
      console.error('Error response from Jupyter:', errorText);
      return NextResponse.json({ error: 'Failed to upload to Jupyter' }, { status: 500 });
    }

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error al subir archivo a Jupyter:', error);
    return NextResponse.json({ error: 'Error al subir archivo a Jupyter' }, { status: 500 });
  }
}
