import { it, expect, describe } from 'vitest';
import { middleware } from '../src/middleware';
import { NextResponse, NextRequest } from 'next/server';

describe('middleware.ts', () => {
  it('should redirect to home if accessToken is not present', async () => {
    const request = new NextRequest(
      new Request(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`),
      {},
    ) as NextRequest;

    const response = await middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toBe(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  });

  it('should allow access if accessToken is present', () => {
    const request = new NextRequest(
      new Request(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, {
        headers: {
          cookie: 'accessToken=valid_token',
        },
      }),
      {},
    ) as NextRequest;

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });
});
