import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../Avatar';

describe('Avatar Component', () => {
  it('renders with username', () => {
    render(<Avatar username="John Doe" />);
    expect(screen.getByTitle('John Doe')).toBeInTheDocument();
  });

  it('displays correct initials for single word', () => {
    render(<Avatar username="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('displays correct initials for two words', () => {
    render(<Avatar username="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('displays correct initials for multiple words', () => {
    render(<Avatar username="John Michael Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('handles empty username', () => {
    render(<Avatar username="" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('handles username with leading/trailing spaces', () => {
    render(<Avatar username="  John Doe  " />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('handles username with multiple spaces', () => {
    render(<Avatar username="John    Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies correct size class', () => {
    const { rerender, container } = render(<Avatar username="John" size="sm" />);
    expect(container.querySelector('.avatar')).toHaveClass('avatar--sm');

    rerender(<Avatar username="John" size="md" />);
    expect(container.querySelector('.avatar')).toHaveClass('avatar--md');

    rerender(<Avatar username="John" size="lg" />);
    expect(container.querySelector('.avatar')).toHaveClass('avatar--lg');
  });

  it('shows status indicator when showStatus is true', () => {
    const { container } = render(<Avatar username="John" showStatus />);
    expect(container.querySelector('.avatar__status')).toBeInTheDocument();
  });

  it('does not show status indicator by default', () => {
    const { container } = render(<Avatar username="John" />);
    expect(container.querySelector('.avatar__status')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar username="John" className="custom-avatar" />);
    expect(container.querySelector('.avatar')).toHaveClass('custom-avatar');
  });

  it('generates consistent colors for same username', () => {
    const { container: container1 } = render(<Avatar username="Alice" />);
    const { container: container2 } = render(<Avatar username="Alice" />);
    
    const circle1 = container1.querySelector('.avatar__circle');
    const circle2 = container2.querySelector('.avatar__circle');
    
    expect(circle1?.getAttribute('style')).toBe(circle2?.getAttribute('style'));
  });

  it('generates different colors for different usernames', () => {
    const { container: container1 } = render(<Avatar username="Alice" />);
    const { container: container2 } = render(<Avatar username="Bob" />);
    
    const circle1 = container1.querySelector('.avatar__circle');
    const circle2 = container2.querySelector('.avatar__circle');
    
    expect(circle1?.getAttribute('style')).not.toBe(circle2?.getAttribute('style'));
  });

  it('capitalizes initials', () => {
    render(<Avatar username="john doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('handles special characters in username', () => {
    render(<Avatar username="@John_123" />);
    expect(screen.getByTitle('@John_123')).toBeInTheDocument();
  });

  it('sets title attribute to username', () => {
    render(<Avatar username="John Doe" />);
    const avatar = screen.getByTitle('John Doe');
    expect(avatar).toHaveAttribute('title', 'John Doe');
  });
});
