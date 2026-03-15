import { render, screen, waitFor } from '@testing-library/react';
import { AdminMenuClient } from '../components/admin-menu-client';

// Mock getApiUrl
jest.mock('@/lib/config', () => ({
  getApiUrl: (path: string) => `http://localhost${path}`,
}));

// Mock safe-image
jest.mock('@/components/ui/safe-image', () => ({
  SafeImage: (props: any) => <img {...props} />,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      data: [
        { id: 1, food_name: 'Test Burger', category_id: 1, price: 100, description: 'Tasty', availability: 1, sort_order: 1 }
      ]
    }),
  })
) as jest.Mock;

describe('AdminMenuClient Component', () => {
  it('renders without crashing and displays product', async () => {
    render(<AdminMenuClient />);
    expect(screen.getByText('Menu Management')).toBeInTheDocument();

    // Wait for product to appear
    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
    });
  });
});
