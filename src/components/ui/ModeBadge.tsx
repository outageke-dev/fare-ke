import React from 'react';
import { Bus, BusFront, Motorbike } from 'lucide-react';

export type TransitMode = 'Bus' | 'Matatu' | 'Motorbike';

const modeConfig: Record<
  TransitMode,
  { icon: React.ReactNode; colorClass: string; bgClass: string }
> = {
  Matatu: {
    icon: <BusFront size={11} />,
    colorClass: 'text-mode-matatu',
    bgClass: 'bg-mode-matatu-bg',
  },
  Bus: {
    icon: <Bus size={11} />,
    colorClass: 'text-mode-bus',
    bgClass: 'bg-mode-bus-bg',
  },
  Motorbike: {
    icon: <Motorbike size={11} />,
    colorClass: 'text-mode-motorbike',
    bgClass: 'bg-mode-motorbike-bg',
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
