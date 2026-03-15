import { render, screen } from '@testing-library/react';
import { NavBar } from '../components/nav-bar';
import { useAuth } from '../store/auth';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock useAuth
jest.mock('../store/auth', () => ({
  useAuth: jest.fn(),
}));

describe('NavBar Authentication UI', () => {
  it('renders Log In and Sign Up buttons when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(<NavBar />);

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('My Account')).not.toBeInTheDocument();
  });

  it('renders My Account button when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    });

    render(<NavBar />);

    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    expect(screen.getByText('My Account')).toBeInTheDocument();
  });
});
