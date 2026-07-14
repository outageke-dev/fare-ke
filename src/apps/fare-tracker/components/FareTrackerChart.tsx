'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,  } from 'recharts';

interface FareDataPoint {
  month: string;
  fare: number;
  prevFare?: number;
}

interface FareTrackerChartProps {
  data: FareDataPoint[];
  routeName: string;
  changeDate?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card-hover px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`tooltip-row-${i}`} className="flex items-center gap-2">
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">KSh {p.value.toFixed(0)}</span>
        </div>
      ))}
    </div>
  );
}

export default function FareTrackerChart({ data, routeName, changeDate }: FareTrackerChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">No chart data yet</p>
          <p className="text-sm text-muted-foreground">
            Once real fare history is available for {routeName || 'this route'}, it can be shown here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="fareGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `KSh ${v.toFixed(0)}`}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        {changeDate && (
          <ReferenceLine
            x={changeDate}
            stroke="var(--accent)"
            strokeDasharray="4 2"
            label={{ value: 'Fare Change', fill: 'var(--accent)', fontSize: 10, position: 'insideTopRight' }}
          />
        )}
        <Line
          type="monotone"
          dataKey="fare"
          name="Current Fare"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
