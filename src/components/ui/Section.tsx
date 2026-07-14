import React from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({
  title,
  subtitle,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={`section ${className}`}>
      {title && (
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
