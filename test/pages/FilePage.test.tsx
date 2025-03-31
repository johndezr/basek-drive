import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileMain from '../../src/components/pages/FilePage';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../../src/components/modules/UserData.tsx', () => ({
  __esModule: true,
  default: () => <div>Mocked Child Component</div>,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useSuspenseQuery: vi.fn(),
}));

describe('FilePage.tsx', () => {
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    localStorage.clear();
    (useRouter as Mock).mockReturnValue({ push: mockRouterPush });
    (useQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it('correctly renders the main elements', () => {
    render(<FileMain token="mockToken" />);

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Index Files')).toBeInTheDocument();

    expect(screen.getByText('No files are indexed yet.')).toBeInTheDocument();
  });

  it('calls logOut and redirects the user when clicking on “Logout”.', () => {
    render(<FileMain token="mockToken" />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(document.cookie).toBe('');
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('opens the file selection dialog by clicking on “Index Files”."', async () => {
    render(<FileMain token="mockToken" />);

    const indexFilesButton = screen.getByText('Index Files');
    fireEvent.click(indexFilesButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('shows correctly indexed files', () => {
    localStorage.setItem(
      'files',
      JSON.stringify([
        { id: '1', name: 'Indexed File 1', type: 'file' },
        { id: '2', name: 'Indexed File 2', type: 'file' },
      ]),
    );

    render(<FileMain token="mockToken" />);

    expect(screen.getByText('Indexed File 1')).toBeInTheDocument();
  });
});
