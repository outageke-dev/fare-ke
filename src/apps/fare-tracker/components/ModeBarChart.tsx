'use client';

import React from 'react';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';

interface ModeStat {
  mode: TransitMode;
  avgFare: number;
  count: number;
}

interface ModeBarChartProps {
  data?: ModeStat[];
}

export default function ModeBarChart({ data }: ModeBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">No mode breakdown yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      {data.map((entry) => (
        <div key={entry.mode} className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-3 py-2">
          <ModeBadge mode={entry.mode} />
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">KSh {entry.avgFare.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">{entry.count} verified routes</p>
          </div>
        </div>
      ))}
    </div>
  );
}
