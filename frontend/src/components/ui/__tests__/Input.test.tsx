import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  it('renders correctly with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Input label="User Name" />);
    const input = screen.getByLabelText('User Name');
    expect(input).toHaveAttribute('id', 'user-name');
  });

  it('uses custom id when provided', () => {
    render(<Input label="Username" id="custom-id" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('applies error class when error prop is provided', () => {
    const { container } = render(<Input error="Error message" />);
    const inputGroup = container.querySelector('.input-group');
    expect(inputGroup).toHaveClass('input-group--error');
  });

  it('renders suffix element', () => {
    render(<Input suffix={<span data-testid="suffix">@</span>} />);
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('calls onChange handler', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'a');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-input" />);
    const inputGroup = container.querySelector('.input-group');
    expect(inputGroup).toHaveClass('custom-input');
  });

  it('supports different input types', () => {
    const { rerender, container } = render(<Input type="email" />);
    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('renders with all props combined', () => {
    render(
      <Input
        label="Email Address"
        placeholder="Enter your email"
        error="Email is required"
        suffix={<span>✉️</span>}
      />
    );
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('✉️')).toBeInTheDocument();
  });
});
