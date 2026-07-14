import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type ChangeDirection = 'up' | 'down' | 'none';

export default function ChangeChip({
  direction,
  pct,
}: {
  direction: ChangeDirection;
  pct: string;
}) {
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-change-up-bg text-change-up">
        <TrendingUp size={11} />
        +{pct}
      </span>
    );
  }
  if (direction === 'down') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-change-down-bg text-change-down">
        <TrendingDown size={11} />
        -{pct}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
      <Minus size={11} />
      No change
    </span>
  );
}