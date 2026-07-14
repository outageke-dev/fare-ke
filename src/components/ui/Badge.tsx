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
    neutral: 'badge bg-muted/20 text-muted-foreground',
  }[variant];

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
