import React from 'react';
import clsx from 'clsx';

type ButtonProps = {
  label: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
};

const Button: React.FC<ButtonProps> = ({ label, onClick, size = 'medium' }) => {

  const baseClasses = 'text-white font-bold text rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 text-center';
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        'bg-emerald-600 hover:bg-emerald-800 transition-all ease-in-out duration-300'
      )}
    >
      {label}
    </button>
  );
};

export default Button;