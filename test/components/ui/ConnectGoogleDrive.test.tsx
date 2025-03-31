import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ConnectGoogleDrive from '../../../src/components/ui/ConnectGoogleDrive';

const mockToastError = vi.fn();
const onPushRouter = vi.fn();
const mockGoogleLoginFn = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnError = vi.fn();
const mockOnNonOAuthError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn((message) => {
      mockToastError(message);
    }),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: onPushRouter,
  }),
}));

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn((options) => {
    mockOnSuccess.mockImplementation(options.onSuccess);
    mockOnError.mockImplementation(options.onError);
    mockOnNonOAuthError.mockImplementation(options.onNonOAuthError);
    return mockGoogleLoginFn;
  }),
}));
vi.mock('lucide-react', () => ({
  LoaderCircle: () => <div>Loading...</div>,
}));

describe('ConnectGoogleDrive', () => {
  beforeEach(() => {
    cleanup();
  });

  it('llama a googleLoginFn cuando se hace clic en el botón', async () => {
    render(<ConnectGoogleDrive />);

    const button = screen.getByTestId('connect-google-drive-button');
    fireEvent.click(button);

    await waitFor(() => expect(button).toBeDisabled());

    expect(mockGoogleLoginFn).toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('llama a onSuccess y redirige al dashboard', async () => {
    render(<ConnectGoogleDrive />);

    const button = screen.getByTestId('connect-google-drive-button');
    fireEvent.click(button);

    const mockTokenResponse = { access_token: 'mockAccessToken' };
    await mockOnSuccess(mockTokenResponse);

    expect(onPushRouter).toHaveBeenCalledWith('/dashboard');
  });

  it('llama a onError y muestra un toast de error', async () => {
    render(<ConnectGoogleDrive />);

    const button = screen.getByTestId('connect-google-drive-button');
    fireEvent.click(button);

    await mockOnError();

    expect(mockToastError).toHaveBeenCalledWith('Error connecting your Google account');
  });

  it('llama a onNonOAuthError y muestra un toast de error', async () => {
    render(<ConnectGoogleDrive />);

    const button = screen.getByTestId('connect-google-drive-button');
    fireEvent.click(button);

    await mockOnNonOAuthError();

    expect(mockToastError).toHaveBeenCalledWith(
      'Popup window is failed to open or closed before an OAuth response is returned. Please, try again.',
    );
  });
  it('muestra el icono de carga mientras se espera la respuesta', () => {
    render(<ConnectGoogleDrive />);

    const button = screen.getByTestId('connect-google-drive-button');
    fireEvent.click(button);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
