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

const modeData = [
  { mode: 'Bus', avgFare: 2.25, count: 142 },
  { mode: 'Train', avgFare: 5.85, count: 87 },
  { mode: 'Metro', avgFare: 3.06, count: 203 },
  { mode: 'Tram', avgFare: 2.88, count: 41 },
];

const modeColors: Record<string, string> = {
  Bus: 'var(--mode-bus)',
  Train: 'var(--mode-train)',
  Metro: 'var(--mode-metro)',
  Tram: 'var(--mode-tram)',
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { mode: string; avgFare: number; count: number } }[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{d.mode}</p>
      <p className="text-muted-foreground">Avg fare: <span className="font-mono font-semibold text-foreground">${d.avgFare.toFixed(2)}</span></p>
      <p className="text-muted-foreground">Routes: <span className="font-semibold text-foreground">{d.count}</span></p>
    </div>
  );
}

export default function ModeBarChart() {
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
          tickFormatter={(v) => `$${v}`}
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