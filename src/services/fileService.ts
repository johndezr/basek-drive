export const downloadFileFromDrive = async (fileId: string) => {
  const response = await fetch('/api/drive/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId }),
  });

  return response.json();
};

export const uploadFileToJupyter = async (formData: FormData) => {
  const response = await fetch('/api/upload-jupyter', {
    method: 'POST',
    body: formData,
  });

  return response;
};
