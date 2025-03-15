import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { filename } = (await req.json()) as { filename: string };

    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename is required' }), { status: 400 });
    }

    const JUPYTER_API_URL = `${process.env.NEXT_PUBLIC_JUPYTER_URL}/api/contents/base-knowledge/${filename}`;
    const JUPYTER_TOKEN = process.env.NEXT_PUBLIC_JUPYTER_TOKEN;

    const response = await fetch(JUPYTER_API_URL, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${JUPYTER_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Jupyter:', errorText);
      return NextResponse.json({ error: 'Failed to delete file from Jupyter' }, { status: 500 });
    }

    return new Response(JSON.stringify({ message: `Archivo ${filename} eliminado` }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error al subir archivo a Jupyter:', error);
    return NextResponse.json({ error: 'Error al eliminar archivo en Jupyter' }, { status: 500 });
  }
}
