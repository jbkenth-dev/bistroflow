import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerDashboardClient } from '../components/customer-dashboard-client';
import { useAuth } from '../store/auth';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useAuth
jest.mock('../store/auth', () => ({
  useAuth: jest.fn(),
}));

describe('CustomerDashboardClient Name Editing', () => {
  const mockUpdateUser = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', firstName: 'John', lastName: 'Doe', name: 'John Doe' },
      updateUser: mockUpdateUser,
    });
    jest.clearAllMocks();
  });

  it('renders the user first name', () => {
    render(<CustomerDashboardClient />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('switches to input mode on click', () => {
    render(<CustomerDashboardClient />);
    const nameSpan = screen.getByText('John');
    fireEvent.click(nameSpan);
    const input = screen.getByLabelText('Edit First Name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('John');
  });

  it('updates name on valid input and blur', () => {
    render(<CustomerDashboardClient />);
    fireEvent.click(screen.getByText('John'));
    const input = screen.getByLabelText('Edit First Name');
    
    fireEvent.change(input, { target: { value: 'Jane' } });
    fireEvent.blur(input);

    expect(mockUpdateUser).toHaveBeenCalledWith({
      firstName: 'Jane',
      name: 'Jane Doe'
    });
  });

  it('validates alphabetic characters only', () => {
    // Mock window.alert since it's used for validation feedback
    window.alert = jest.fn();
    
    render(<CustomerDashboardClient />);
    fireEvent.click(screen.getByText('John'));
    const input = screen.getByLabelText('Edit First Name');
    
    fireEvent.change(input, { target: { value: 'Jane123' } });
    fireEvent.blur(input);

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('alphabetic characters'));
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('validates max length', () => {
    window.alert = jest.fn();
    
    render(<CustomerDashboardClient />);
    fireEvent.click(screen.getByText('John'));
    const input = screen.getByLabelText('Edit First Name');
    
    const longName = 'A'.repeat(51);
    fireEvent.change(input, { target: { value: longName } });
    fireEvent.blur(input);

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('50 characters'));
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
