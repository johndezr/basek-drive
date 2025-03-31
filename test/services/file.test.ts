import { vi, describe, it, expect } from 'vitest';
import {
  fetchUserFiles,
  downloadFileFromDrive,
  uploadFileToJupyter,
} from '../../src/services/file';
import type { File } from '@/domain/models/File';

describe('services/file.ts', () => {
  it('fetchUserFiles - should throw an error if no token is provided', async () => {
    const userFiles = fetchUserFiles('');
    await expect(userFiles).rejects.toThrow('No token provided');
  });
  it('fetchUserFiles - should throw an error if the response is not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    ) as unknown as typeof fetch;

    const userFiles = fetchUserFiles('valid_token');
    await expect(userFiles).rejects.toThrow('Failed to fetch user files');
  });
  it('fetchUserFiles - should return user files if the response is ok', async () => {
    const mockFiles: File[] = [
      {
        id: '1',
        name: 'file1.txt',
        size: 1234,
        createdTime: '2023-10-01T12:00:00Z',
        mimeType: 'text/plain',
        parentFolderName: 'folder1',
        type: 'file',
      },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFiles),
      }),
    ) as unknown as typeof fetch;

    const userFiles = await fetchUserFiles('valid_token');
    expect(userFiles).toEqual(mockFiles);
  });

  it('downloadFileFromDrive - should throw an error if no fileId is provided', async () => {
    const downloadFile = downloadFileFromDrive('');
    await expect(downloadFile).rejects.toThrow('No fileId provided');
  });
  it('downloadFileFromDrive - should throw an error if the response is not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    ) as unknown as typeof fetch;

    const downloadFile = downloadFileFromDrive('valid_file_id');
    await expect(downloadFile).rejects.toThrow('Failed to fetch user files');
  });
  it('downloadFileFromDrive - should return user files if the response is ok', async () => {
    const mockFiles: File[] = [
      {
        id: '1',
        name: 'file1.txt',
        size: 1234,
        createdTime: '2023-10-01T12:00:00Z',
        mimeType: 'text/plain',
        parentFolderName: 'folder1',
        type: 'file',
      },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFiles),
      }),
    ) as unknown as typeof fetch;

    const userFiles = await downloadFileFromDrive('valid_file_id');
    expect(userFiles).toEqual(mockFiles);
  });
  it('uploadFileToJupyter - should throw an error if no formData is provided', async () => {
    const uploadFile = uploadFileToJupyter(null as unknown as FormData);
    await expect(uploadFile).rejects.toThrow('No formData provided');
  });
});
