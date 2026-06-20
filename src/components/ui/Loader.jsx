import React from 'react';

const Loader = ({ size = 'md', variant = 'spinner' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  if (variant === 'spinner') {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 dark:border-t-green-400 animate-spin"
          />
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className="space-y-3 w-full">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-5/6" />
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-4/6" />
    </div>
  );
};

export default Loader;
