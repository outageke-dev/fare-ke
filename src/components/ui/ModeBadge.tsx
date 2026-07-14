import React from 'react';
import { Bus, Train, Zap, TramFront } from 'lucide-react';

export type TransitMode = 'Bus' | 'Train' | 'Metro' | 'Tram';

const modeConfig: Record<
  TransitMode,
  { icon: React.ReactNode; colorClass: string; bgClass: string }
> = {
  Bus: {
    icon: <Bus size={11} />,
    colorClass: 'text-mode-bus',
    bgClass: 'bg-mode-bus-bg',
  },
  Train: {
    icon: <Train size={11} />,
    colorClass: 'text-mode-train',
    bgClass: 'bg-mode-train-bg',
  },
  Metro: {
    icon: <Zap size={11} />,
    colorClass: 'text-mode-metro',
    bgClass: 'bg-mode-metro-bg',
  },
  Tram: {
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