import React from 'react';

const Input = ({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border-2 rounded-lg 
          dark:bg-gray-700 dark:text-white dark:border-gray-600
          bg-white text-gray-900 border-gray-300
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          transition-colors duration-200
          ${error ? 'border-red-500 dark:border-red-400' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
