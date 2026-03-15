import { render, screen } from '@testing-library/react';
import { AdminShell } from '../components/admin-shell';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/admin/dashboard',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

// Mock useAuth
jest.mock('@/store/auth', () => ({
  useAuth: () => ({
    user: { role: 'admin' },
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
    aside: ({ children, className }: any) => <aside className={className}>{children}</aside>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

describe('AdminShell Component', () => {
  it('renders without crashing', () => {
    render(
      <AdminShell>
        <div>Admin Content</div>
      </AdminShell>
    );
    expect(screen.getByText('BISTRO')).toBeInTheDocument();
    expect(screen.getByText('FLOW')).toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(
      <AdminShell>
        <div>Admin Content</div>
      </AdminShell>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });
});
