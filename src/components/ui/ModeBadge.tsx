import React from 'react';
import { Bus, Zap, TramFront } from 'lucide-react';

export type TransitMode = 'SACCO' | 'Matatu' | 'Bus';

const modeConfig: Record<
  TransitMode,
  { icon: React.ReactNode; colorClass: string; bgClass: string }
> = {
  SACCO: {
    icon: <Bus size={11} />,
    colorClass: 'text-mode-bus',
    bgClass: 'bg-mode-bus-bg',
  },
  Matatu: {
    icon: <Zap size={11} />,
    colorClass: 'text-mode-metro',
    bgClass: 'bg-mode-metro-bg',
  },
  Bus: {
    icon: <TramFront size={11} />,
    colorClass: 'text-mode-tram',
    bgClass: 'bg-mode-tram-bg',
  },
};

export default function ModeBadge({ mode }: { mode: TransitMode }) {
  const config = modeConfig[mode];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bgClass} ${config.colorClass}`}
    >
      {config.icon}
      {mode}
    </span>
  );
}