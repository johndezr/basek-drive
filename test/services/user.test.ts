import { describe, expect, it, vi } from 'vitest';
import { fetchUserInfo } from '../../src/services/user';

describe('services/user.ts', () => {
  it('should throw an error if no token is provided', async () => {
    const userInfo = fetchUserInfo('');

    await expect(userInfo).rejects.toThrow('No token found');
  });

  it('should throw an error if the response is not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    ) as unknown as typeof fetch;

    const userInfo = fetchUserInfo('valid_token');

    await expect(userInfo).rejects.toThrow('Failed to fetch user info');
  });

  it('should return user info if the response is ok', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      }),
    ) as unknown as typeof fetch;

    const userInfo = await fetchUserInfo('valid_token');
    expect(userInfo).toEqual(mockUser);
  });
});
