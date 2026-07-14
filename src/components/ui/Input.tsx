import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  required = false,
  id,
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label} {required && <span aria-label="required" className="text-accent">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`input-field ${error ? 'ring-2 ring-red-500 border-red-500' : ''}`}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
