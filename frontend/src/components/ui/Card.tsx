import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import './Card.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

const Card = ({ children, className, header, footer, ...props }: CardProps) => (
  <div className={clsx('card', className)} {...props}>
    {header && <div className="card__header">{header}</div>}
    <div className="card__body">{children}</div>
    {footer && <div className="card__footer">{footer}</div>}
  </div>
);
export default Card;
