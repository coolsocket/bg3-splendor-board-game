import React from 'react';
import './CardBase.css';

export interface CardBaseProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  isHoverable?: boolean;
  isSelected?: boolean;
  role?: string;
  'aria-label'?: string;
  title?: string;
}

export const CardBase: React.FC<CardBaseProps> = ({
  children,
  className = '',
  onClick,
  isHoverable = true,
  isSelected = false,
  role,
  'aria-label': ariaLabel,
  title
}) => {
  return (
    <div
      className={`card-base ${isHoverable ? 'card-hoverable' : ''} ${isSelected ? 'card-selected' : ''} ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </div>
  );
};
