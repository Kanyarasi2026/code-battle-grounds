import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, iconLeft, iconRight, className, ...props }, ref) => (
    <button ref={ref} className={clsx('btn', `btn--${variant}`, `btn--${size}`, loading && 'btn--loading', className)} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="btn__spinner" size={16} /> : iconLeft && <span className="btn__icon btn__icon--left">{iconLeft}</span>}
      <span className="btn__label">{children}</span>
      {iconRight && !loading && <span className="btn__icon btn__icon--right">{iconRight}</span>}
    </button>
  ),
);
Button.displayName = 'Button';
export default Button;
