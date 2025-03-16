import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const { fileName, parentFolderName } = (await req.json()) as {
    fileName: string;
    parentFolderName: string;
  };

  const JUPYTER_API_URL = `${process.env.NEXT_PUBLIC_JUPYTER_URL}/api/contents`;
  const JUPYTER_TOKEN = process.env.NEXT_PUBLIC_JUPYTER_TOKEN;

  if (parentFolderName) {
    // Eliminamos la carpeta raíz, lo que eliminará todas las subcarpetas
    const rootFolder = parentFolderName && parentFolderName.split('/').filter(Boolean)[0];

    try {
      const deleteResponse = await fetch(`${JUPYTER_API_URL}/${rootFolder}`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${JUPYTER_TOKEN}` },
      });

      if (deleteResponse.ok) {
        return NextResponse.json({
          message: `File ${fileName} and folder ${rootFolder} (with all its contents) removed`,
        });
      } else {
        const errorText = await deleteResponse.text();
        return NextResponse.json({
          message: `File ${fileName} deleted, but could not delete root folder ${rootFolder}`,
          error: errorText,
        });
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Error processing root folder deletion', err },
        { status: 500 },
      );
    }
  } else {
    try {
      if (!fileName) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
      }

      const response = await fetch(`${JUPYTER_API_URL}/${fileName}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${JUPYTER_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: errorText }, { status: 500 });
      }
      return NextResponse.json({ message: `File ${fileName} deleted` });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}
