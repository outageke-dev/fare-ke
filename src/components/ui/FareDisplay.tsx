import React from 'react';

interface FareDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  currency?: string;
}

export default function FareDisplay({
  amount,
  size = 'md',
  label,
  currency = 'KES',
}: FareDisplayProps) {
  const sizeClass = {
    sm: 'fare-sm',
    md: 'fare-md',
    lg: 'fare-lg',
  }[size];

  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-muted-foreground font-medium">{label}</p>}
      <div className={`${sizeClass} text-foreground`}>
        {currency} {amount.toLocaleString()}
      </div>
    </div>
  );
}
