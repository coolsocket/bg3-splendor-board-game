import React from 'react';

export interface CardBaseProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  isHoverable?: boolean;
  isSelected?: boolean;
  role?: string;
  'aria-label'?: string;
  title?: string;
  tabIndex?: number;
  overflowVisible?: boolean;
}

export const CardBase: React.FC<CardBaseProps> = ({
  id,
  children,
  className = '',
  onClick,
  isHoverable = true,
  isSelected = false,
  role,
  'aria-label': ariaLabel,
  title,
  tabIndex,
  overflowVisible = false,
}) => {
  return (
    <div
      id={id}
      className={`w-full aspect-[2/3] rounded-md relative ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} box-border transition-all duration-200 flex flex-col ${isHoverable ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.6),0_0_15px_rgba(212,175,55,0.5)] hover:z-[var(--z-interactive)]' : ''} ${isSelected ? 'outline outline-3 outline-[#38bdf8] outline-offset-2' : ''} ${className}`}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex !== undefined ? tabIndex : (onClick ? 0 : undefined)}
      aria-label={ariaLabel}
      title={title}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {children}
    </div>
  );
};
