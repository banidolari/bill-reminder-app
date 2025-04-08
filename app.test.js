import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock components and functions
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

// Test authentication functionality
describe('Authentication', () => {
  // Test login form
  describe('LoginForm', () => {
    it('should render login form correctly', async () => {
      // Import dynamically to avoid issues with Next.js components
      const { LoginForm } = await import('../src/components/auth/LoginForm');
      
      render(<LoginForm />);
      
      // Check if form elements are rendered
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
    
    it('should show validation errors for empty fields', async () => {
      const { LoginForm } = await import('../src/components/auth/LoginForm');
      
      render(<LoginForm />);
      
      // Submit form without filling fields
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
    
    it('should call login function with correct data', async () => {
      const mockLogin = vi.fn().mockResolvedValue({ success: true });
      const { LoginForm } = await import('../src/components/auth/LoginForm');
      
      render(<LoginForm onLogin={mockLogin} />);
      
      // Fill form fields
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      // Check if login function was called with correct data
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });
  
  // Test registration form
  describe('RegisterForm', () => {
    it('should render registration form correctly', async () => {
      const { RegisterForm } = await import('../src/components/auth/RegisterForm');
      
      render(<RegisterForm />);
      
      // Check if form elements are rendered
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
    
    it('should show validation error when passwords do not match', async () => {
      const { RegisterForm } = await import('../src/components/auth/RegisterForm');
      
      render(<RegisterForm />);
      
      // Fill form fields with non-matching passwords
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test User' },
      });
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password456' },
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });
});

// Test bill management functionality
describe('Bill Management', () => {
  // Test bill form
  describe('BillForm', () => {
    it('should render bill form correctly', async () => {
      const { BillForm } = await import('../src/components/bills/BillForm');
      
      // Mock categories and payment methods
      const mockCategories = [
        { id: 'cat1', name: 'Utilities', color: '#3B82F6', icon: 'lightning-bolt' },
        { id: 'cat2', name: 'Housing', color: '#10B981', icon: 'home' },
      ];
      
      const mockPaymentMethods = [
        { id: 'pm1', name: 'Credit Card', type: 'credit' },
        { id: 'pm2', name: 'Bank Transfer', type: 'bank' },
      ];
      
      render(
        <BillForm 
          categories={mockCategories} 
          paymentMethods={mockPaymentMethods} 
        />
      );
      
      // Check if form elements are rendered
      expect(screen.getByLabelText(/bill name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/payment method/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
    
    it('should call onSubmit with correct data when form is submitted', async () => {
      const { BillForm } = await import('../src/components/bills/BillForm');
      
      // Mock categories and payment methods
      const mockCategories = [
        { id: 'cat1', name: 'Utilities', color: '#3B82F6', icon: 'lightning-bolt' },
      ];
      
      const mockPaymentMethods = [
        { id: 'pm1', name: 'Credit Card', type: 'credit' },
      ];
      
      const mockOnSubmit = vi.fn();
      
      render(
        <BillForm 
          categories={mockCategories} 
          paymentMethods={mockPaymentMethods}
          onSubmit={mockOnSubmit}
        />
      );
      
      // Fill form fields
      fireEvent.change(screen.getByLabelText(/bill name/i), {
        target: { value: 'Electricity Bill' },
      });
      
      fireEvent.change(screen.getByLabelText(/amount/i), {
        target: { value: '85.50' },
      });
      
      fireEvent.change(screen.getByLabelText(/due date/i), {
        target: { value: '2025-04-15' },
      });
      
      // Select category
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'cat1' },
      });
      
      // Select payment method
      fireEvent.change(screen.getByLabelText(/payment method/i), {
        target: { value: 'pm1' },
      });
      
      // Select status
      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'unpaid' },
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      // Check if onSubmit was called with correct data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Electricity Bill',
          amount: 85.5,
          due_date: '2025-04-15',
          category_id: 'cat1',
          payment_method_id: 'pm1',
          status: 'unpaid',
        });
      });
    });
  });
  
  // Test bills list
  describe('BillsList', () => {
    it('should render bills list correctly', async () => {
      const { BillsList } = await import('../src/components/bills/BillsList');
      
      // Mock bills data
      const mockBills = [
        {
          id: 'bill1',
          name: 'Electricity Bill',
          amount: 85.50,
          due_date: '2025-04-15',
          category_name: 'Utilities',
          category_color: '#3B82F6',
          status: 'unpaid',
        },
        {
          id: 'bill2',
          name: 'Rent',
          amount: 1200.00,
          due_date: '2025-05-01',
          category_name: 'Housing',
          category_color: '#10B981',
          status: 'unpaid',
        },
      ];
      
      render(<BillsList bills={mockBills} />);
      
      // Check if bills are rendered
      expect(screen.getByText('Electricity Bill')).toBeInTheDocument();
      expect(screen.getByText('$85.50')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.getByText('$1,200.00')).toBeInTheDocument();
    });
    
    it('should filter bills by status', async () => {
      const { BillsList } = await import('../src/components/bills/BillsList');
      
      // Mock bills data with different statuses
      const mockBills = [
        {
          id: 'bill1',
          name: 'Electricity Bill',
          amount: 85.50,
          due_date: '2025-04-15',
          category_name: 'Utilities',
          category_color: '#3B82F6',
          status: 'unpaid',
        },
        {
          id: 'bill2',
          name: 'Water Bill',
          amount: 45.75,
          due_date: '2025-04-05',
          category_name: 'Utilities',
          category_color: '#3B82F6',
          status: 'paid',
        },
      ];
      
      render(<BillsList bills={mockBills} />);
      
      // Initially both bills should be visible
      expect(screen.getByText('Electricity Bill')).toBeInTheDocument();
      expect(screen.getByText('Water Bill')).toBeInTheDocument();
      
      // Filter by unpaid
      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'unpaid' },
      });
      
      // Only unpaid bill should be visible
      await waitFor(() => {
        expect(screen.getByText('Electricity Bill')).toBeInTheDocument();
        expect(screen.queryByText('Water Bill')).not.toBeInTheDocument();
      });
      
      // Filter by paid
      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'paid' },
      });
      
      // Only paid bill should be visible
      await waitFor(() => {
        expect(screen.queryByText('Electricity Bill')).not.toBeInTheDocument();
        expect(screen.getByText('Water Bill')).toBeInTheDocument();
      });
    });
  });
});

// Test document management functionality
describe('Document Management', () => {
  // Test document scanner
  describe('BillScanner', () => {
    beforeEach(() => {
      // Mock navigator.mediaDevices
      Object.defineProperty(global.navigator, 'mediaDevices', {
        value: {
          getUserMedia: vi.fn().mockResolvedValue({}),
        },
        writable: true,
      });
    });
    
    it('should render camera interface correctly', async () => {
      const { BillScanner } = await import('../src/components/documents/BillScanner');
      
      render(<BillScanner />);
      
      // Check if camera elements are rendered
      expect(screen.getByTestId('camera-container')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /capture/i })).toBeInTheDocument();
    });
    
    it('should call onCapture when photo is taken', async () => {
      const { BillScanner } = await import('../src/components/documents/BillScanner');
      
      const mockOnCapture = vi.fn();
      
      render(<BillScanner onCapture={mockOnCapture} />);
      
      // Click capture button
      fireEvent.click(screen.getByRole('button', { name: /capture/i }));
      
      // Check if onCapture was called
      await waitFor(() => {
        expect(mockOnCapture).toHaveBeenCalled();
      });
    });
  });
  
  // Test documents manager
  describe('DocumentsManager', () => {
    it('should render documents list correctly', async () => {
      const { DocumentsManager } = await import('../src/components/documents/DocumentsManager');
      
      // Mock documents data
      const mockDocuments = [
        {
          id: 'doc1',
          file_name: 'electricity_bill.pdf',
          file_type: 'application/pdf',
          file_size: 1250000,
          created_at: '2025-04-01T12:00:00Z',
        },
        {
          id: 'doc2',
          file_name: 'water_bill.jpg',
          file_type: 'image/jpeg',
          file_size: 850000,
          created_at: '2025-04-02T14:30:00Z',
        },
      ];
      
      render(<DocumentsManager documents={mockDocuments} />);
      
      // Check if documents are rendered
      expect(screen.getByText('electricity_bill.pdf')).toBeInTheDocument();
      expect(screen.getByText('water_bill.jpg')).toBeInTheDocument();
    });
    
    it('should call onDelete when delete button is clicked', async () => {
      const { DocumentsManager } = await import('../src/components/documents/DocumentsManager');
      
      // Mock documents data
      const mockDocuments = [
        {
          id: 'doc1',
          file_name: 'electricity_bill.pdf',
          file_type: 'application/pdf',
          file_size: 1250000,
          created_at: '2025-04-01T12:00:00Z',
        },
      ];
      
      const mockOnDelete = vi.fn();
      
      render(
        <DocumentsManager 
          documents={mockDocuments} 
          onDelete={mockOnDelete}
        />
      );
      
      // Click delete button
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      
      // Confirm deletion
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      
      // Check if onDelete was called with correct document id
      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith('doc1');
      });
    });
  });
});

// Test calendar integration
describe('Calendar Integration', () => {
  it('should render calendar correctly', async () => {
    const { CalendarIntegration } = await import('../src/components/calendar/CalendarIntegration');
    
    // Mock bills data
    const mockBills = [
      {
        id: 'bill1',
        name: 'Electricity Bill',
        amount: 85.50,
        due_date: '2025-04-15',
        status: 'unpaid',
      },
      {
        id: 'bill2',
        name: 'Rent',
        amount: 1200.00,
        due_date: '2025-05-01',
        status: 'unpaid',
      },
    ];
    
    render(<CalendarIntegration bills={mockBills} />);
    
    // Check if calendar elements are rendered
    expect(screen.getByText(/april 2025/i)).toBeInTheDocument();
    
    // Check if navigation buttons are rendered
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });
  
  it('should highlight days with bills', async () => {
    const { CalendarIntegration } = await import('../src/components/calendar/CalendarIntegration');
    
    // Get current date for testing
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Create due dates in current month
    const dueDate1 = new Date(currentYear, currentMonth, 15);
    const dueDate2 = new Date(currentYear, currentMonth, 20);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Mock bills data with due dates in current month
    const mockBills = [
      {
        id: 'bill1',
        name: 'Electricity Bill',
        amount: 85.50,
        due_date: formatDate(dueDate1),
        status: 'unpaid',
      },
      {
        id: 'bill2',
        name: 'Internet Bill',
        amount: 59.99,
        due_date: formatDate(dueDate2),
        status: 'unpaid',
      },
    ];
    
    render(<CalendarIntegration bills={mockBills} />);
    
    // Check if days with bills are highlighted
    const day15 = screen.getByText('15').closest('.calendar-day');
    const day20 = screen.getByText('20').closest('.calendar-day');
    
    expect(day15).toHaveClass
(Content truncated due to size limit. Use line ranges to read in chunks)