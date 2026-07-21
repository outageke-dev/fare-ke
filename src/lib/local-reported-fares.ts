export interface LocalFareReportInput {
  from: string;
  to: string;
  operator: string;
  fare: number;
  traffic?: string;
  weather?: string;
  notes?: string;
}

export interface LocalReportedFareItem {
  id: string;
  route: string;
  operator: string;
  fare: number;
  reportedAt: string;
  confirmedBy: number;
  context: string;
  window: string;
  weather: string;
  fuel: string;
}

const LOCAL_STORAGE_KEY = 'faretrack_local_reports';

export function getLocalReportedFares(): LocalReportedFareItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalReportedFareItem[];
  } catch (error) {
    console.error('Failed to read local reported fares:', error);
    return [];
  }
}

export function addLocalReportedFare(input: LocalFareReportInput): LocalReportedFareItem {
  const item: LocalReportedFareItem = {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    route: `${input.from} → ${input.to}`,
    operator: input.operator,
    fare: input.fare,
    reportedAt: 'Just now',
    confirmedBy: 1,
    context: input.notes ? input.notes : 'Community report',
    window: input.traffic ? `${input.traffic} traffic` : 'Recent report',
    weather: input.weather ?? '—',
    fuel: '—',
  };

  const entries = getLocalReportedFares();
  entries.unshift(item);
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  return item;
}
