import React from 'react';

const Alert = ({ children, variant = 'info', className = '' }) => {
  const baseStyles = "p-4 rounded-xl flex items-start gap-3";
  
  const variantStyles = {
    info: "bg-blue-50 border border-blue-100 text-blue-800",
    warning: "bg-amber-50 border border-amber-100 text-amber-800",
    error: "bg-red-50 border border-red-100 text-red-800",
    success: "bg-green-50 border border-green-100 text-green-800"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;