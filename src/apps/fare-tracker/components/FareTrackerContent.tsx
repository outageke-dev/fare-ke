'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, TrendingDown, Bell, Trash2, Plus, Clock, MapPin, RefreshCw, AlertTriangle, CheckCircle, Activity,  } from 'lucide-react';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';
import ChangeChip, { ChangeDirection } from '@/components/ui/ChangeChip';
import { toast } from 'sonner';

const FareTrackerChart = dynamic(() => import('./FareTrackerChart'), { ssr: false });
const ModeBarChart = dynamic(() => import('./ModeBarChart'), { ssr: false });

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Backend: GET /api/tracker/routes?userId= for user's tracked routes
interface TrackedRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  agency: string;
  mode: TransitMode;
  origin: string;
  destination: string;
  currentFare: number;
  previousFare: number;
  changeDirection: ChangeDirection;
  changePct: string;
  changeDate: string;
  lastChecked: string;
  alertsEnabled: boolean;
  city: string;
  fareHistory: { month: string; fare: number }[];
}

const trackedRoutes: TrackedRoute[] = [
  {
    id: 'track-001',
    routeNumber: 'M1',
    routeName: 'Red Line — Downtown Express',
    agency: 'Metro Transit Authority',
    mode: 'Metro',
    origin: 'O\'Hare International Airport',
    destination: 'Loop / Washington',
    currentFare: 2.50,
    previousFare: 2.25,
    changeDirection: 'up',
    changePct: '11.1%',
    changeDate: 'Apr 2026',
    lastChecked: 'Jul 14, 2026',
    alertsEnabled: true,
    city: 'Chicago, IL',
    fareHistory: [
      { month: 'Jan', fare: 2.25 },
      { month: 'Feb', fare: 2.25 },
      { month: 'Mar', fare: 2.25 },
      { month: 'Apr', fare: 2.50 },
      { month: 'May', fare: 2.50 },
      { month: 'Jun', fare: 2.50 },
      { month: 'Jul', fare: 2.50 },
    ],
  },
  {
    id: 'track-002',
    routeNumber: 'BART-OAK',
    routeName: 'Oakland — SF Transbay',
    agency: 'Bay Area Rapid Transit',
    mode: 'Train',
    origin: 'Oakland 12th St / City Center',
    destination: 'Embarcadero, San Francisco',
    currentFare: 4.30,
    previousFare: 3.90,
    changeDirection: 'up',
    changePct: '10.3%',
    changeDate: 'Jun 2026',
    lastChecked: 'Jul 12, 2026',
    alertsEnabled: true,
    city: 'San Francisco Bay Area',
    fareHistory: [
      { month: 'Jan', fare: 3.75 },
      { month: 'Feb', fare: 3.90 },
      { month: 'Mar', fare: 3.90 },
      { month: 'Apr', fare: 4.10 },
      { month: 'May', fare: 4.10 },
      { month: 'Jun', fare: 4.30 },
      { month: 'Jul', fare: 4.30 },
    ],
  },
  {
    id: 'track-003',
    routeNumber: '22',
    routeName: 'Clark Street Bus',
    agency: 'Chicago Transit Authority',
    mode: 'Bus',
    origin: 'Howard Terminal',
    destination: 'Navy Pier',
    currentFare: 2.25,
    previousFare: 2.00,
    changeDirection: 'up',
    changePct: '12.5%',
    changeDate: 'Apr 2026',
    lastChecked: 'Jul 8, 2026',
    alertsEnabled: false,
    city: 'Chicago, IL',
    fareHistory: [
      { month: 'Jan', fare: 2.00 },
      { month: 'Feb', fare: 2.00 },
      { month: 'Mar', fare: 2.00 },
      { month: 'Apr', fare: 2.25 },
      { month: 'May', fare: 2.25 },
      { month: 'Jun', fare: 2.25 },
      { month: 'Jul', fare: 2.25 },
    ],
  },
  {
    id: 'track-004',
    routeNumber: 'T-Blue',
    routeName: 'Blue Line — Airport',
    agency: 'MBTA',
    mode: 'Metro',
    origin: 'Bowdoin',
    destination: 'Logan Airport',
    currentFare: 2.40,
    previousFare: 2.40,
    changeDirection: 'none',
    changePct: '0%',
    changeDate: '—',
    lastChecked: 'Jul 5, 2026',
    alertsEnabled: true,
    city: 'Boston, MA',
    fareHistory: [
      { month: 'Jan', fare: 2.40 },
      { month: 'Feb', fare: 2.40 },
      { month: 'Mar', fare: 2.40 },
      { month: 'Apr', fare: 2.40 },
      { month: 'May', fare: 2.40 },
      { month: 'Jun', fare: 2.40 },
      { month: 'Jul', fare: 2.40 },
    ],
  },
  {
    id: 'track-005',
    routeNumber: 'DC-RED',
    routeName: 'Red Line — Shady Grove to Glenmont',
    agency: 'Washington Metro (WMATA)',
    mode: 'Metro',
    origin: 'Shady Grove',
    destination: 'Union Station',
    currentFare: 3.85,
    previousFare: 3.65,
    changeDirection: 'up',
    changePct: '5.5%',
    changeDate: 'Apr 2026',
    lastChecked: 'Jul 13, 2026',
    alertsEnabled: false,
    city: 'Washington, D.C.',
    fareHistory: [
      { month: 'Jan', fare: 3.50 },
      { month: 'Feb', fare: 3.65 },
      { month: 'Mar', fare: 3.65 },
      { month: 'Apr', fare: 3.85 },
      { month: 'May', fare: 3.85 },
      { month: 'Jun', fare: 3.85 },
      { month: 'Jul', fare: 3.85 },
    ],
  },
  {
    id: 'track-006',
    routeNumber: 'SF-F',
    routeName: 'F Market & Wharves Streetcar',
    agency: 'San Francisco Municipal Railway',
    mode: 'Tram',
    origin: 'Castro / Market',
    destination: 'Fisherman\'s Wharf',
    currentFare: 3.00,
    previousFare: 2.75,
    changeDirection: 'up',
    changePct: '9.1%',
    changeDate: 'Apr 2026',
    lastChecked: 'Jul 9, 2026',
    alertsEnabled: true,
    city: 'San Francisco, CA',
    fareHistory: [
      { month: 'Jan', fare: 2.75 },
      { month: 'Feb', fare: 2.75 },
      { month: 'Mar', fare: 2.75 },
      { month: 'Apr', fare: 3.00 },
      { month: 'May', fare: 3.00 },
      { month: 'Jun', fare: 3.00 },
      { month: 'Jul', fare: 3.00 },
    ],
  },
  {
    id: 'track-007',
    routeNumber: 'NJ-123',
    routeName: 'Northeast Corridor — Express',
    agency: 'NJ Transit Rail',
    mode: 'Train',
    origin: 'Newark Penn Station',
    destination: 'New York Penn Station',
    currentFare: 6.75,
    previousFare: 7.00,
    changeDirection: 'down',
    changePct: '3.6%',
    changeDate: 'May 2026',
    lastChecked: 'Jul 11, 2026',
    alertsEnabled: true,
    city: 'New York Metro Area',
    fareHistory: [
      { month: 'Jan', fare: 6.50 },
      { month: 'Feb', fare: 7.00 },
      { month: 'Mar', fare: 7.00 },
      { month: 'Apr', fare: 7.00 },
      { month: 'May', fare: 6.75 },
      { month: 'Jun', fare: 6.75 },
      { month: 'Jul', fare: 6.75 },
    ],
  },
];

// ─── Alert Feed ───────────────────────────────────────────────────────────────
interface FareAlert {
  id: string;
  routeNumber: string;
  routeName: string;
  mode: TransitMode;
  alertType: 'increase' | 'decrease' | 'verified' | 'warning';
  message: string;
  timestamp: string;
  fareChange?: string;
}

const fareAlerts: FareAlert[] = [
  {
    id: 'alert-001',
    routeNumber: 'BART-OAK',
    routeName: 'Oakland — SF Transbay',
    mode: 'Train',
    alertType: 'increase',
    message: 'Fare increased from $4.10 to $4.30 effective June 1, 2026',
    timestamp: '2 days ago',
    fareChange: '+$0.20',
  },
  {
    id: 'alert-002',
    routeNumber: 'NJ-123',
    routeName: 'Northeast Corridor',
    mode: 'Train',
    alertType: 'decrease',
    message: 'Off-peak fare reduced from $7.00 to $6.75 — promotional pricing',
    timestamp: '5 days ago',
    fareChange: '-$0.25',
  },
  {
    id: 'alert-003',
    routeNumber: 'DC-RED',
    routeName: 'Red Line — Shady Grove',
    mode: 'Metro',
    alertType: 'warning',
    message: 'WMATA announced potential fare increase in Q3 2026 — unconfirmed',
    timestamp: '1 week ago',
    fareChange: undefined,
  },
  {
    id: 'alert-004',
    routeNumber: 'M1',
    routeName: 'Red Line — Downtown Express',
    mode: 'Metro',
    alertType: 'verified',
    message: 'Fare data re-verified by 8 contributors after April increase',
    timestamp: '1 week ago',
    fareChange: undefined,
  },
  {
    id: 'alert-005',
    routeNumber: 'SF-F',
    routeName: 'F Market & Wharves',
    mode: 'Tram',
    alertType: 'increase',
    message: 'Fare increased from $2.75 to $3.00 effective April 1, 2026',
    timestamp: '3 months ago',
    fareChange: '+$0.25',
  },
];

export default function FareTrackerContent() {
  const [routes,setRoutes] = useState(trackedRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('track-001');
  const [alertsMap, setAlertsMap] = useState<Record<string, boolean>>(
    Object.fromEntries(trackedRoutes.map((r) => [r.id, r.alertsEnabled]))
  );
  const [filterMode, setFilterMode] = useState<TransitMode | 'All'>('All');
  const [sortCol, setSortCol] = useState<'fare' | 'change' | 'checked'>('checked');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const filteredRoutes = routes
    .filter((r) => filterMode === 'All' || r.mode === filterMode)
    .sort((a, b) => {
      if (sortCol === 'fare') return b.currentFare - a.currentFare;
      if (sortCol === 'change') return Math.abs(b.currentFare - b.previousFare) - Math.abs(a.currentFare - a.previousFare);
      return 0;
    });

  const handleRemove = (id: string) => {
    const route = routes.find((r) => r.id === id);
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    if (selectedRouteId === id && routes.length > 1) {
      setSelectedRouteId(routes.find((r) => r.id !== id)?.id || '');
    }
    toast.success(`Removed ${route?.routeName} from tracker`);
  };

  const handleToggleAlert = (id: string) => {
    setAlertsMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast.success(next[id] ? 'Fare alerts enabled' : 'Fare alerts disabled');
      return next;
    });
  };

  // KPI summary
  const totalTracked = routes.length;
  const fareIncreases = routes.filter((r) => r.changeDirection === 'up').length;
  const fareDecreases = routes.filter((r) => r.changeDirection === 'down').length;
  const alertsActive = Object.values(alertsMap).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fare Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor fare changes across your tracked routes. Alerts fire when a fare is updated.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
            <Activity size={12} className="text-[color:var(--status-verified)]" />
            <span>Live — synced Jul 14, 2026</span>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus size={15} />
            Track Route
          </a>
        </div>
      </div>

      {/* KPI Cards — 4 cards → 2×2 on md, 4-col on xl */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Routes Tracked"
          value={String(totalTracked)}
          sub="across 5 cities"
          icon={<TrendingUp size={18} />}
          color="primary"
        />
        <KpiCard
          label="Fare Increases (90d)"
          value={String(fareIncreases)}
          sub="routes with higher fares"
          icon={<TrendingUp size={18} />}
          color="danger"
        />
        <KpiCard
          label="Fare Decreases (90d)"
          value={String(fareDecreases)}
          sub="routes with lower fares"
          icon={<TrendingDown size={18} />}
          color="success"
        />
        <KpiCard
          label="Active Alerts"
          value={String(alertsActive)}
          sub="routes with alerts on"
          icon={<Bell size={18} />}
          color="warning"
        />
      </div>

      {/* Main Grid: Chart + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Panel */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl shadow-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Fare History</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  7-month price trend for selected route
                </p>
              </div>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="text-xs bg-input border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring max-w-[220px] truncate"
              >
                {routes.map((r) => (
                  <option key={`chart-select-${r.id}`} value={r.id}>
                    {r.routeNumber} — {r.routeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected route summary */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{selectedRoute.routeNumber}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground truncate">{selectedRoute.routeName}</span>
                  <ModeBadge mode={selectedRoute.mode} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin size={10} />
                  {selectedRoute.origin} → {selectedRoute.destination}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="fare-value text-xl text-foreground">${selectedRoute.currentFare.toFixed(2)}</div>
                <ChangeChip direction={selectedRoute.changeDirection} pct={selectedRoute.changePct} />
              </div>
            </div>

            <FareTrackerChart
              data={selectedRoute.fareHistory}
              routeName={selectedRoute.routeName}
              changeDate={selectedRoute.changeDate !== '—' ? selectedRoute.changeDate : undefined}
            />
          </div>

          {/* Avg Fare by Mode */}
          <div className="bg-card border border-border rounded-xl shadow-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-1">Avg Single Fare by Mode</h2>
            <p className="text-xs text-muted-foreground mb-4">Based on all verified fares in the FareTrack database</p>
            <ModeBarChart />
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="bg-card border border-border rounded-xl shadow-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Fare Change Alerts</h2>
            <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-semibold">
              {fareAlerts.length} new
            </span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin">
            {fareAlerts.map((alert) => (
              <AlertFeedItem key={alert.id} alert={alert} />
            ))}
          </div>
          <div className="pt-3 border-t border-border mt-3">
            <button className="w-full text-xs text-primary font-medium hover:underline">
              View all alerts →
            </button>
          </div>
        </div>
      </div>

      {/* Tracked Routes Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">Tracked Routes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredRoutes.length} of {routes.length} routes shown
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mode filter */}
            <div className="flex items-center gap-1">
              {(['All', 'Bus', 'Train', 'Metro', 'Tram'] as (TransitMode | 'All')[]).map((mode) => (
                <button
                  key={`filter-${mode}`}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                    filterMode === mode
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/40 text-muted-foreground border-border hover:border-primary/30'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <select
              value={sortCol}
              onChange={(e) => setSortCol(e.target.value as 'fare' | 'change' | 'checked')}
              className="text-xs bg-input border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="checked">Sort: Last Checked</option>
              <option value="fare">Sort: Fare Amount</option>
              <option value="change">Sort: Change Size</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Route
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Mode
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Origin → Destination
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Current Fare
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Prev Fare
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Change
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Changed On
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Last Checked
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Alerts
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route, idx) => (
                <tr
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-muted/40 ${
                    selectedRouteId === route.id ? 'bg-primary/5' : idx % 2 === 1 ? 'bg-muted/10' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary leading-tight text-center">
                          {route.routeNumber}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-xs truncate max-w-[140px]">
                          {route.routeName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                          {route.agency}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <ModeBadge mode={route.mode} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {route.origin}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      → {route.destination}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="fare-value text-base text-foreground">
                      ${route.currentFare.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="fare-value text-sm text-muted-foreground">
                      ${route.previousFare.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <ChangeChip direction={route.changeDirection} pct={route.changePct} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-muted-foreground font-mono">{route.changeDate}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {route.lastChecked}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleAlert(route.id); }}
                      title={alertsMap[route.id] ? 'Disable fare alerts' : 'Enable fare alerts'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        alertsMap[route.id]
                          ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Bell size={14} />
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(route.id); }}
                        title="Remove from tracker — this cannot be undone"
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-[color:var(--status-outdated-bg)] hover:text-[color:var(--status-outdated)] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center">
                        <TrendingUp size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No tracked routes</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        You haven&apos;t tracked any routes in this mode yet. Search for routes and click &ldquo;Track&rdquo; to add them here.
                      </p>
                      <a
                        href="/"
                        className="mt-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Search Routes
                      </a>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing {filteredRoutes.length} tracked route{filteredRoutes.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw size={11} />
            <span>Fares checked daily against contributor reports</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: 'primary' | 'danger' | 'success' | 'warning';
}) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    danger: 'bg-[color:var(--change-up-bg)] text-[color:var(--change-up)]',
    success: 'bg-[color:var(--change-down-bg)] text-[color:var(--change-down)]',
    warning: 'bg-accent/15 text-accent-foreground',
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight mb-1">
          {label}
        </p>
        <p className="fare-value text-2xl text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}

// ─── Alert Feed Item ──────────────────────────────────────────────────────────
function AlertFeedItem({ alert }: { alert: FareAlert }) {
  const iconMap = {
    increase: <TrendingUp size={14} className="text-[color:var(--change-up)]" />,
    decrease: <TrendingDown size={14} className="text-[color:var(--change-down)]" />,
    verified: <CheckCircle size={14} className="text-[color:var(--status-verified)]" />,
    warning: <AlertTriangle size={14} className="text-[color:var(--status-pending)]" />,
  };

  const bgMap = {
    increase: 'bg-[color:var(--change-up-bg)]',
    decrease: 'bg-[color:var(--change-down-bg)]',
    verified: 'bg-[color:var(--status-verified-bg)]',
    warning: 'bg-[color:var(--status-pending-bg)]',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${bgMap[alert.alertType]}`}>
        {iconMap[alert.alertType]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-bold text-primary">{alert.routeNumber}</span>
          <ModeBadge mode={alert.mode} />
          {alert.fareChange && (
            <span
              className={`text-xs font-mono font-bold ${
                alert.alertType === 'increase' ?'text-[color:var(--change-up)]' :'text-[color:var(--change-down)]'
              }`}
            >
              {alert.fareChange}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          <Clock size={9} />
          {alert.timestamp}
        </p>
      </div>
    </div>
  );
}