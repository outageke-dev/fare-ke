import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Archive } from 'lucide-react';

export type ContribStatus = 'Verified' | 'Pending' | 'Outdated' | 'Archived';

const statusConfig: Record<
  ContribStatus,
  { icon: React.ReactNode; colorClass: string; bgClass: string }
> = {
  Verified: {
    icon: <CheckCircle size={11} />,
    colorClass: 'text-[color:var(--status-verified)]',
    bgClass: 'bg-[color:var(--status-verified-bg)]',
  },
  Pending: {
    icon: <Clock size={11} />,
    colorClass: 'text-[color:var(--status-pending)]',
    bgClass: 'bg-[color:var(--status-pending-bg)]',
  },
  Outdated: {
    icon: <AlertTriangle size={11} />,
    colorClass: 'text-[color:var(--status-outdated)]',
    bgClass: 'bg-[color:var(--status-outdated-bg)]',
  },
  Archived: {
    icon: <Archive size={11} />,
    colorClass: 'text-[color:var(--status-archived)]',
    bgClass: 'bg-[color:var(--status-archived-bg)]',
  },
};

export default function StatusBadge({ status }: { status: ContribStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bgClass} ${config.colorClass}`}
    >
      {config.icon}
      {status}
    </span>
  );
}