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

// Mock icons to avoid rendering issues if any
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

describe('CustomerDashboardClient Estimated Time', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Estimated Time when status is Preparing', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('active-order.php')) {
            return Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    data: {
                        id: 1,
                        status: 'preparing', // API returns lowercase, component capitalizes it
                        total_amount: 100,
                        items_summary: 'Test Item',
                        estimated_time: '20 min',
                        progress: 50,
                        steps: [
                            { label: 'Placed', active: true, completed: true },
                            { label: 'Preparing', active: true, completed: false }, // Active step
                            { label: 'Ready', active: false, completed: false },
                            { label: 'Served', active: false, completed: false }
                        ],
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

    // Wait for the component to finish loading active order
    await waitFor(() => {
        expect(screen.getAllByText('Active Order').length).toBeGreaterThan(0);
    });

    // Expect "Estimated Time" to be visible
    expect(screen.getByText('Estimated Time')).toBeInTheDocument();
    expect(screen.getByText('20 min')).toBeInTheDocument();
  });

  it('does NOT render Estimated Time when status is Placed (pending)', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('active-order.php')) {
            return Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    data: {
                        id: 2,
                        status: 'pending', // 'Placed'
                        total_amount: 100,
                        items_summary: 'Test Item',
                        estimated_time: '20 min',
                        progress: 25,
                        steps: [
                            { label: 'Placed', active: true, completed: true },
                            { label: 'Preparing', active: false, completed: false },
                            { label: 'Ready', active: false, completed: false },
                            { label: 'Served', active: false, completed: false }
                        ],
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
        expect(screen.getAllByText('Active Order').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('Estimated Time')).not.toBeInTheDocument();
  });

  it('does NOT render Estimated Time when status is Ready', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('active-order.php')) {
            return Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    data: {
                        id: 3,
                        status: 'ready', 
                        total_amount: 100,
                        items_summary: 'Test Item',
                        estimated_time: '20 min',
                        progress: 75,
                        steps: [
                            { label: 'Placed', active: true, completed: true },
                            { label: 'Preparing', active: false, completed: true },
                            { label: 'Ready', active: true, completed: false },
                            { label: 'Served', active: false, completed: false }
                        ],
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
        expect(screen.getAllByText('Active Order').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('Estimated Time')).not.toBeInTheDocument();
  });
});
