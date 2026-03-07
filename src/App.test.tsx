import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock dependencies
vi.mock('@/routes/router', () => ({
  default: () => <div data-testid="app-router">AppRouter</div>,
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock('@/pages/splashScreen', () => ({
  default: ({ onFinish }: { onFinish: () => void }) => (
    <div data-testid="splash-screen">
      <button onClick={onFinish}>Finish Splash</button>
    </div>
  ),
}));

vi.mock('@/hooks/useNativeNavigate', () => ({
  useNativeNavigate: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('wraps content in AuthProvider', () => {
    render(<App />);
    const authProvider = screen.getByTestId('auth-provider');
    expect(authProvider).toBeInTheDocument();
  });

  it('renders AppRouter', () => {
    render(<App />);
    const appRouter = screen.getByTestId('app-router');
    expect(appRouter).toBeInTheDocument();
  });

  it('shows SplashScreen initially', () => {
    render(<App />);
    const splashScreen = screen.getByTestId('splash-screen');
    expect(splashScreen).toBeInTheDocument();
  });

  it('hides SplashScreen after onFinish is called', async () => {
    render(<App />);

    const splashScreen = screen.getByTestId('splash-screen');
    expect(splashScreen).toBeInTheDocument();

    const finishButton = screen.getByText('Finish Splash');
    finishButton.click();

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    });
  });

  it('keeps AppRouter visible after splash finishes', async () => {
    render(<App />);

    const finishButton = screen.getByText('Finish Splash');
    finishButton.click();

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    });

    const appRouter = screen.getByTestId('app-router');
    expect(appRouter).toBeInTheDocument();
  });

  it('keeps AuthProvider wrapper after splash finishes', async () => {
    render(<App />);

    const finishButton = screen.getByText('Finish Splash');
    finishButton.click();

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    });

    const authProvider = screen.getByTestId('auth-provider');
    expect(authProvider).toBeInTheDocument();
  });

  it('uses useNativeNavigate hook without errors', () => {
    // The hook is mocked and called by the App component
    // If there are any issues with the hook, the render will fail
    expect(() => render(<App />)).not.toThrow();
  });

  it('maintains splashDone state correctly', async () => {
    const { rerender } = render(<App />);

    // Initially splash screen is shown
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();

    // Click finish
    const finishButton = screen.getByText('Finish Splash');
    finishButton.click();

    // Splash screen should be hidden
    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    });

    // Rerender should maintain state
    rerender(<App />);
    expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('renders structure correctly: AuthProvider > (SplashScreen + AppRouter)', () => {
    const { container } = render(<App />);
    const authProvider = screen.getByTestId('auth-provider');

    // Check that both splash screen and app router are inside auth provider
    expect(authProvider).toContainElement(screen.getByTestId('splash-screen'));
    expect(authProvider).toContainElement(screen.getByTestId('app-router'));
  });

  it('handles rapid splash finish clicks gracefully', async () => {
    render(<App />);

    const finishButton = screen.getByText('Finish Splash');

    // Click multiple times rapidly
    finishButton.click();
    finishButton.click();
    finishButton.click();

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    });

    // Should still work correctly
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });
});