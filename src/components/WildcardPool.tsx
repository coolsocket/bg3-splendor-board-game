import React from 'react';
import { Token } from './Token';

interface WildcardPoolProps {
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const WildcardPool: React.FC<WildcardPoolProps> = ({
  count,
  onClick,
  disabled = false,
  size = 'md'
}) => {
  return (
    <div className="flex items-center border-l border-white/10 pl-6">
      <div className={`flex flex-col items-center relative transition-all duration-200 rounded-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_var(--color-wildcard)]'}`}>
        <Token
          type="TRUE_SOUL_TADPOLE"
          count={count}
          onClick={onClick}
          disabled={disabled}
          size={size}
        />
      </div>
    </div>
  );
};
