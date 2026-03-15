import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CustomerDashboardClient } from '../../components/customer-dashboard-client';
import '@testing-library/jest-dom';

// Mock all the dependencies
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: mockReplace,
};
const mockSearchParams = {
  get: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

const mockUpdateUser = jest.fn();
const mockUser = { id: 123, role: 'customer', firstName: 'Test' };
const mockAuth = {
  user: mockUser,
  isAuthenticated: true,
  updateUser: mockUpdateUser,
};

jest.mock('@/store/auth', () => ({
  useAuth: () => mockAuth,
}));

jest.mock('@/components/ui/notification-provider', () => ({
  useNotification: () => ({ showNotification: jest.fn() }),
}));

// Mock icons
jest.mock('@/components/ui/icons', () => ({
  IconCart: () => <div data-testid="icon-cart" />,
  IconPeso: () => <div data-testid="icon-peso" />,
  IconStar: () => <div data-testid="icon-star" />,
  IconGCash: () => <div data-testid="icon-gcash" />,
  IconCash: () => <div data-testid="icon-cash" />,
  IconDineIn: () => <div data-testid="icon-dine-in" />,
  IconTakeout: () => <div data-testid="icon-takeout" />,
  IconArrowRight: () => <div data-testid="icon-arrow-right" />,
  IconClock: () => <div data-testid="icon-clock" />,
  IconMapPin: () => <div data-testid="icon-map-pin" />,
  IconList: () => <div data-testid="icon-list" />,
  IconSettings: () => <div data-testid="icon-settings" />,
  IconCheck: () => <div data-testid="icon-check" />,
  IconClose: () => <div data-testid="icon-close" />,
}));

jest.mock('@/components/order-list', () => ({
  OrderList: () => <div data-testid="order-list" />,
}));

// Use waitFor from testing-library instead of global.fetch mocks resolving promises that might be delayed
global.fetch = jest.fn();

describe('CustomerDashboardClient Image Rendering', () => {
  it('renders order image correctly', async () => {
    // Mock the response to include an image
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('active-order.php')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            data: {
              id: 1,
              status: 'preparing',
              total_amount: 100,
              items_summary: 'Burger',
              estimated_time: '20 min',
              progress: 50,
              steps: [],
              payment_method: 'cash',
              order_image: 'http://example.com/burger.jpg'
            }
          })
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    await act(async () => {
      render(<CustomerDashboardClient />);
    });

    // Wait for the active order to load
    await waitFor(() => {
        expect(screen.getAllByText('Active Order').length).toBeGreaterThan(0);
    });

    // Check if the image is rendered
    await waitFor(() => {
        // We look for the image by its alt text.
        // If the component hasn't re-rendered with the image data yet, this will fail or wait.
        // We need to ensure the condition inside waitFor is sufficient.
        const img = screen.getByAltText('Order Item');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'http://example.com/burger.jpg');
    }, { timeout: 4000 });
  });
});
