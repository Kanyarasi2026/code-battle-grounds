import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with header', () => {
    render(<Card header={<h2>Card Header</h2>}>Content</Card>);
    expect(screen.getByText('Card Header')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(<Card footer={<div>Card Footer</div>}>Content</Card>);
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('renders with header, body, and footer', () => {
    render(
      <Card
        header={<h2>Header</h2>}
        footer={<button>Action</button>}
      >
        Body content
      </Card>
    );
    
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-card');
  });

  it('applies correct BEM class structure', () => {
    const { container } = render(
      <Card header="Header" footer="Footer">Content</Card>
    );
    
    expect(container.querySelector('.card')).toBeInTheDocument();
    expect(container.querySelector('.card__header')).toBeInTheDocument();
    expect(container.querySelector('.card__body')).toBeInTheDocument();
    expect(container.querySelector('.card__footer')).toBeInTheDocument();
  });

  it('passes through HTML attributes', () => {
    const { container } = render(
      <Card data-testid="custom-card" aria-label="Test card">
        Content
      </Card>
    );
    
    const card = container.querySelector('.card');
    expect(card).toHaveAttribute('data-testid', 'custom-card');
    expect(card).toHaveAttribute('aria-label', 'Test card');
  });

  it('renders without header when not provided', () => {
    const { container } = render(<Card>Content only</Card>);
    expect(container.querySelector('.card__header')).not.toBeInTheDocument();
  });

  it('renders without footer when not provided', () => {
    const { container } = render(<Card>Content only</Card>);
    expect(container.querySelector('.card__footer')).not.toBeInTheDocument();
  });

  it('handles complex content in body', () => {
    render(
      <Card>
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Card>
    );
    
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
