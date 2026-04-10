import React from 'react';
import { Token } from './Token';
import './WildcardPool.css';

interface WildcardPoolProps {
  count: number;
  onClick?: () => void;
  disabled?: boolean;
}

export const WildcardPool: React.FC<WildcardPoolProps> = ({
  count,
  onClick,
  disabled = false
}) => {
  return (
    <div className="wildcard-pool">
      <h4 className="wildcard-title text-parchment">Wildcard</h4>
      <div className={`token-stack-container stack-true_soul_tadpole ${disabled ? 'disabled' : ''}`}>
        <Token
          type="TRUE_SOUL_TADPOLE"
          count={count}
          onClick={onClick}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
