'use client';

import React from 'react';

interface FareDataPoint {
  month: string;
  fare: number;
  prevFare?: number;
}

interface FareTrackerChartProps {
  data?: FareDataPoint[];
  routeName?: string;
  changeDate?: string;
}

export default function FareTrackerChart({ data, routeName, changeDate }: FareTrackerChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">No chart data yet</p>
          <p className="text-sm text-muted-foreground">
            Once real fare history is available for {routeName || 'this route'}, it can be shown
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-semibold text-foreground">{routeName || 'Fare history'}</p>
      {changeDate && <p className="mt-1 text-xs text-muted-foreground">Last change: {changeDate}</p>}
      <div className="mt-4 space-y-2">
        {data.map((point) => (
          <div key={point.month} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{point.month}</span>
            <span className="font-mono font-semibold text-foreground">KSh {point.fare.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
