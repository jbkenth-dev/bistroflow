import { render, screen } from '@testing-library/react';
import { Footer } from '../components/footer';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByText('BISTRO')).toBeInTheDocument();
    expect(screen.getByText('FLOW')).toBeInTheDocument();
  });

  it('contains contact information', () => {
    render(<Footer />);
    expect(screen.getByText('0951 676 1071')).toBeInTheDocument();
  });

  it('contains service hours', () => {
    render(<Footer />);
    expect(screen.getByText('11:00 AM - 8:00 PM')).toBeInTheDocument();
  });
});
