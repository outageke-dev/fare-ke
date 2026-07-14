'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const modeData: { mode: string; avgFare: number; count: number }[] = [];

const modeColors: Record<string, string> = {
  Bus: 'var(--mode-bus)',
  Matatu: 'var(--mode-matatu)',
  Motorbike: 'var(--mode-motorbike)',
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { mode: string; avgFare: number; count: number } }[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{d.mode}</p>
      <p className="text-muted-foreground">Avg fare: <span className="font-mono font-semibold text-foreground">KSh {d.avgFare.toFixed(0)}</span></p>
      <p className="text-muted-foreground">Routes: <span className="font-semibold text-foreground">{d.count}</span></p>
    </div>
  );
}

export default function ModeBarChart() {
  if (!modeData.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">No mode breakdown yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={modeData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barSize={28}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="mode"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `KSh ${v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="avgFare" radius={[4, 4, 0, 0]}>
          {modeData.map((entry) => (
            <Cell key={`bar-${entry.mode}`} fill={modeColors[entry.mode]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
