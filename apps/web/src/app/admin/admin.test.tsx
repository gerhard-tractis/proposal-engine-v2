import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from './page';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock proposals data
vi.mock('@/data/proposals', () => ({
  proposals: [
    {
      slug: 'test-proposal',
      token: 'test123456',
      type: 'standard',
      client: {
        name: 'Test Client',
        logo: '/logos/test.svg',
        colors: {
          primary: '#ff0000',
          accent: '#00ff00',
        },
      },
      proposal: {
        executiveSummary: 'Test summary',
        features: [],
        roadmap: [],
      },
    },
  ],
}));

describe('Admin Page Authentication', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('Login Screen', () => {
    it('should show login screen when not authenticated', () => {
      render(<AdminPage />);

      expect(screen.getByText('Admin Login')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter admin password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should not show dashboard when not authenticated', () => {
      render(<AdminPage />);

      expect(screen.queryByText('Proposal Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('should accept correct password and show dashboard', async () => {
      render(<AdminPage />);

      const passwordInput = screen.getByPlaceholderText('Enter admin password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Enter correct password
      fireEvent.change(passwordInput, { target: { value: 'tractis2024' } });
      fireEvent.click(loginButton);

      // Should show dashboard after login
      await waitFor(() => {
        expect(screen.getByText('Proposal Admin')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('should reject incorrect password', async () => {
      // Spy on window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<AdminPage />);

      const passwordInput = screen.getByPlaceholderText('Enter admin password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Enter wrong password
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      // Should show alert and stay on login screen
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Incorrect password');
        expect(screen.getByText('Admin Login')).toBeInTheDocument();
      });

      alertSpy.mockRestore();
    });

    it('should clear password input after failed login', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<AdminPage />);

      const passwordInput = screen.getByPlaceholderText('Enter admin password') as HTMLInputElement;
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Enter wrong password
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      // Password should be cleared
      await waitFor(() => {
        expect(passwordInput.value).toBe('');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Session Persistence', () => {
    it('should persist authentication in sessionStorage', async () => {
      render(<AdminPage />);

      const passwordInput = screen.getByPlaceholderText('Enter admin password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Login successfully
      fireEvent.change(passwordInput, { target: { value: 'tractis2024' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(sessionStorage.getItem('admin_authenticated')).toBe('true');
      });
    });

    it('should auto-authenticate if session exists', () => {
      // Set session before rendering
      sessionStorage.setItem('admin_authenticated', 'true');

      render(<AdminPage />);

      // Should show dashboard immediately, not login screen
      expect(screen.getByText('Proposal Admin')).toBeInTheDocument();
      expect(screen.queryByText('Admin Login')).not.toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('should show logout button when authenticated', async () => {
      // Set session to authenticated
      sessionStorage.setItem('admin_authenticated', 'true');

      render(<AdminPage />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should logout and return to login screen', async () => {
      // Set session to authenticated
      sessionStorage.setItem('admin_authenticated', 'true');

      render(<AdminPage />);

      // Verify we're on dashboard
      expect(screen.getByText('Proposal Admin')).toBeInTheDocument();

      // Click logout
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      // Should return to login screen
      await waitFor(() => {
        expect(screen.getByText('Admin Login')).toBeInTheDocument();
        expect(screen.queryByText('Proposal Admin')).not.toBeInTheDocument();
      });
    });

    it('should clear sessionStorage on logout', async () => {
      sessionStorage.setItem('admin_authenticated', 'true');

      render(<AdminPage />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(sessionStorage.getItem('admin_authenticated')).toBeNull();
      });
    });
  });

  describe('Security Validation', () => {
    it('should not accept empty password', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<AdminPage />);

      const loginButton = screen.getByRole('button', { name: /login/i });

      // Try to login with empty password
      fireEvent.click(loginButton);

      // Should reject and stay on login
      await waitFor(() => {
        expect(screen.getByText('Admin Login')).toBeInTheDocument();
      });

      alertSpy.mockRestore();
    });

    it('should require exact password match (case-sensitive)', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<AdminPage />);

      const passwordInput = screen.getByPlaceholderText('Enter admin password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Try wrong case
      fireEvent.change(passwordInput, { target: { value: 'TRACTIS2024' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Incorrect password');
      });

      alertSpy.mockRestore();
    });
  });
});
