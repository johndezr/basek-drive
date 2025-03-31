export const formatCreatedTime = (createdTime: string) => {
  const date = new Date(createdTime);
  return date.toLocaleString();
};

export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }
  const k = 1024;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(size) / Math.log(k));

  return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
