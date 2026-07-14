import React from 'react';

interface ListItemProps {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  meta?: React.ReactNode;
  onClick?: () => void;
}

export default function ListItem({
  primary,
  secondary,
  meta,
  onClick,
}: ListItemProps) {
  return (
    <button
      className="list-item w-full text-left"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{primary}</p>
        {secondary && (
          <p className="text-xs text-muted-foreground mt-1">{secondary}</p>
        )}
      </div>
      {meta && (
        <div className="text-sm font-semibold text-foreground ml-2 shrink-0">
          {meta}
        </div>
      )}
    </button>
  );
}
