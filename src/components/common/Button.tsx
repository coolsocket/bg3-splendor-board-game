import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary: "bg-gradient-to-b from-gold to-gold-dark text-black border border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:enabled:from-[#ffdf00] hover:enabled:to-gold hover:enabled:shadow-[0_0_10px_rgba(212,175,55,0.6)]",
  secondary: "bg-white/10 text-parchment border border-white/20 hover:enabled:bg-white/20 hover:enabled:text-white hover:enabled:border-white/40",
  icon: "bg-transparent border-none p-1 text-gold hover:enabled:text-white hover:enabled:bg-white/10 hover:enabled:rounded-full"
};

const sizeClasses = {
  sm: "py-1 px-3 text-[0.8rem]",
  md: "py-2 px-6 text-[0.9rem]",
  lg: "py-3 px-8 text-[1rem]"
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center cursor-pointer transition-all duration-200 font-fantasy font-bold rounded-sm outline-none hover:enabled:-translate-y-0.5 active:enabled:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50";
  
  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
