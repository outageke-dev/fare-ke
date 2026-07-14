import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'primary',
  children,
  className = '',
}: BadgeProps) {
  const variantClass = {
    primary: 'badge-primary',
    success: 'badge-success',
    danger: 'badge-danger',
    neutral: 'badge text-muted-foreground',
  }[variant];

  const neutralStyle = variant === 'neutral' ? { backgroundColor: 'rgba(154, 154, 154, 0.1)' } : undefined;

  return (
    <span className={`badge ${variantClass} ${className}`} style={neutralStyle}>
      {children}
    </span>
  );
}
