import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CustomerDashboardClient } from '../../components/customer-dashboard-client';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock("next/navigation", () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };
  const mockSearchParams = {
    get: jest.fn(),
  };
  return {
    useRouter: () => mockRouter,
    useSearchParams: () => mockSearchParams,
  };
});

// Mock Auth Store
jest.mock("@/store/auth", () => {
  const mockUser = { id: 5, role: 'customer', firstName: 'TestUser', profilePic: 'pic.jpg' };
  const mockUpdateUser = jest.fn();
  return {
    useAuth: () => ({
      isAuthenticated: true,
      user: mockUser,
      updateUser: mockUpdateUser,
    }),
  };
});

// Mock Notification
jest.mock("@/components/ui/notification-provider", () => ({
  useNotification: () => ({
    showNotification: jest.fn(),
  }),
}));

// Mock OrderList component
jest.mock("@/components/order-list", () => ({
  OrderList: () => <div data-testid="order-list">Order List</div>,
}));

// Mock Icons to avoid rendering issues
jest.mock("@/components/ui/icons", () => ({
  IconCart: () => <span data-testid="icon-cart" />,
  IconPeso: () => <span data-testid="icon-peso" />,
  IconStar: () => <span data-testid="icon-star" />,
  IconGCash: () => <span data-testid="icon-gcash" />,
  IconCash: () => <span data-testid="icon-cash" />,
  IconDineIn: () => <span data-testid="icon-dine-in" />,
  IconTakeout: () => <span data-testid="icon-takeout" />,
  IconArrowRight: () => <span data-testid="icon-arrow-right" />,
  IconClock: () => <span data-testid="icon-clock" />,
  IconMapPin: () => <span data-testid="icon-map-pin" />,
  IconList: () => <span data-testid="icon-list" />,
  IconSettings: () => <span data-testid="icon-settings" />,
  IconCheck: () => <span data-testid="icon-check" />,
  IconClose: () => <span data-testid="icon-close" />,
}));

// Mock fetch
global.fetch = jest.fn();

describe('CustomerDashboardClient Active Order Image', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the active order image when provided by API', async () => {
    const mockOrderData = {
      success: true,
      data: {
        id: 31,
        status: 'preparing',
        items_summary: 'Burger, Fries',
        estimated_time: '15 min',
        progress: 50,
        steps: [
          { label: 'Placed', active: true, completed: true },
          { label: 'Preparing', active: true, completed: false },
          { label: 'Ready', active: false, completed: false },
          { label: 'Served', active: false, completed: false }
        ],
        payment_method: 'cash',
        total_amount: 500,
        order_image: 'http://localhost/uploads/burger.jpg',
        recent_order_types: ['dine-in']
      }
    };

    (global.fetch as jest.Mock).mockImplementation((url) => {
        return Promise.resolve({
            json: () => Promise.resolve(mockOrderData),
            ok: true
        });
    });

    await act(async () => {
      render(<CustomerDashboardClient />);
    });

    // Wait for the active order to be displayed
    await waitFor(() => {
      expect(screen.getAllByText(/Active Order/i).length).toBeGreaterThan(0);
    });

    // Check if the image is rendered with correct src
    const image = screen.getByAltText('Order');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://localhost/uploads/burger.jpg');
  });

  it('renders without image when API returns null image', async () => {
    const mockOrderData = {
      success: true,
      data: {
        id: 32,
        status: 'preparing',
        items_summary: 'Water',
        estimated_time: '5 min',
        progress: 20,
        steps: [],
        payment_method: 'cash',
        total_amount: 50,
        order_image: null,
        recent_order_types: []
      }
    };

    (global.fetch as jest.Mock).mockImplementation((url) => {
        return Promise.resolve({
            json: () => Promise.resolve(mockOrderData),
            ok: true
        });
    });

    await act(async () => {
      render(<CustomerDashboardClient />);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Active Order/i).length).toBeGreaterThan(0);
    });

    // Image should NOT be present
    const image = screen.queryByAltText('Order');
    expect(image).not.toBeInTheDocument();
  });
});
