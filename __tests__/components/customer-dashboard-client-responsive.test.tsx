import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CustomerDashboardClient } from '../../components/customer-dashboard-client';
import '@testing-library/jest-dom';

// Mock hooks
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
  useNotification: () => ({
    showNotification: jest.fn(),
  }),
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

// Mock global fetch
global.fetch = jest.fn();

describe('CustomerDashboardClient Mobile Responsiveness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders KPI grid with responsive classes', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('active-order.php')) {
            return Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    data: {
                        id: 1,
                        status: 'preparing',
                        total_amount: 100,
                        items_summary: 'Test Item',
                        estimated_time: '20 min',
                        progress: 50,
                        steps: [],
                        payment_method: 'cash'
                    }
                })
            });
        }
        return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    await act(async () => {
      render(<CustomerDashboardClient />);
    });

    await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    // Check for grid classes on the container
    // We need to find the grid container. It contains the KPIs.
    const paymentMethodLabel = screen.getByText('Payment Method');
    // Traverse up to find the grid container
    // Hierarchy: span -> div(flex) -> div(relative z-10) -> motion.div(card) -> div(grid)
    const card = paymentMethodLabel.closest('.bg-white');
    const grid = card?.parentElement;
    
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-3');
    expect(grid).toHaveClass('gap-2');
    expect(grid).toHaveClass('md:gap-4');
  });
});
