'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, BookmarkPlus, ChevronDown, ChevronUp, MapPin, Clock, Users, Star, X, Info, AlertTriangle,  } from 'lucide-react';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';
import StatusBadge, { ContribStatus } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Backend: connect to /api/fares?q=&mode=&agency=&city= for real search
interface FareResult {
  id: string;
  routeNumber: string;
  routeName: string;
  agency: string;
  city: string;
  mode: TransitMode;
  origin: string;
  destination: string;
  singleFare: number;
  weeklyPass: number | null;
  monthlyPass: number | null;
  zone: string;
  peakFare: number | null;
  offPeakFare: number | null;
  distance: string;
  lastVerified: string;
  contributors: number;
  status: ContribStatus;
  accessible: boolean;
  rating: number;
  fareHistory: { month: string; fare: number }[];
}

const mockFares: FareResult[] = [
  {
    id: 'fare-001',
    routeNumber: 'JAT-01',
    routeName: 'Jatco Executive — Nairobi Premium',
    agency: 'Jatco SACCO',
    city: 'Nairobi, Kenya',
    mode: 'SACCO',
    origin: 'Nairobi City Center',
    destination: 'Mombasa Central Station',
    singleFare: 1200,
    weeklyPass: 8400,
    monthlyPass: 32000,
    zone: 'Route A–B',
    peakFare: 1200,
    offPeakFare: 1000,
    distance: '487 km',
    lastVerified: '07/10/2026',
    contributors: 24,
    status: 'Verified',
    accessible: true,
    rating: 4.7,
    fareHistory: [
      { month: 'Feb', fare: 1100 },
      { month: 'Mar', fare: 1100 },
      { month: 'Apr', fare: 1200 },
      { month: 'May', fare: 1200 },
      { month: 'Jun', fare: 1200 },
      { month: 'Jul', fare: 1200 },
    ],
  },
  {
    id: 'fare-002',
    routeNumber: 'ASC-22',
    routeName: 'Acsend City Link',
    agency: 'Acsend SACCO',
    city: 'Nairobi, Kenya',
    mode: 'Matatu',
    origin: 'Nairobi CBD',
    destination: 'Nakuru Town',
    singleFare: 450,
    weeklyPass: 3150,
    monthlyPass: 12000,
    zone: 'Flat Fare',
    peakFare: 450,
    offPeakFare: 350,
    distance: '162 km',
    lastVerified: '07/08/2026',
    contributors: 11,
    status: 'Verified',
    accessible: true,
    rating: 4.2,
    fareHistory: [
      { month: 'Feb', fare: 400 },
      { month: 'Mar', fare: 400 },
      { month: 'Apr', fare: 450 },
      { month: 'May', fare: 450 },
      { month: 'Jun', fare: 450 },
      { month: 'Jul', fare: 450 },
    ],
  },
  {
    id: 'fare-003',
    routeNumber: 'COS-123',
    routeName: 'Coastal Express — Premium Route',
    agency: 'Coastal SACCO',
    city: 'Mombasa, Kenya',
    mode: 'SACCO',
    origin: 'Mombasa Bus Station',
    destination: 'Malindi Central',
    singleFare: 600,
    weeklyPass: 4200,
    monthlyPass: 16000,
    zone: 'Zone 3',
    peakFare: 700,
    offPeakFare: 600,
    distance: '118 km',
    lastVerified: '07/11/2026',
    contributors: 38,
    status: 'Verified',
    accessible: true,
    rating: 4.5,
    fareHistory: [
      { month: 'Feb', fare: 550 },
      { month: 'Mar', fare: 550 },
      { month: 'Apr', fare: 600 },
      { month: 'May', fare: 600 },
      { month: 'Jun', fare: 600 },
      { month: 'Jul', fare: 600 },
    ],
  },
  {
    id: 'fare-004',
    routeNumber: 'DAR-01',
    routeName: 'Dar Express — Western Route',
    agency: 'Dar Express SACCO',
    city: 'Kisumu, Kenya',
    mode: 'SACCO',
    origin: 'Kisumu Central',
    destination: 'Nakuru Town',
    singleFare: 650,
    weeklyPass: 4550,
    monthlyPass: 17300,
    zone: 'Zone A',
    peakFare: 650,
    offPeakFare: 550,
    distance: '221 km',
    lastVerified: '06/28/2026',
    contributors: 7,
    status: 'Pending',
    accessible: true,
    rating: 3.9,
    fareHistory: [
      { month: 'Feb', fare: 600 },
      { month: 'Mar', fare: 650 },
      { month: 'Apr', fare: 650 },
      { month: 'May', fare: 650 },
      { month: 'Jun', fare: 650 },
      { month: 'Jul', fare: 650 },
    ],
  },
  {
    id: 'fare-005',
    routeNumber: 'MAC-09',
    routeName: 'Majani Express — City Shuttle',
    agency: 'Majani SACCO',
    city: 'Nairobi, Kenya',
    mode: 'Matatu',
    origin: 'Nairobi East End',
    destination: 'Karen / South C',
    singleFare: 150,
    weeklyPass: 1050,
    monthlyPass: 4000,
    zone: 'Flat Fare',
    peakFare: null,
    offPeakFare: null,
    distance: '28 km',
    lastVerified: '07/05/2026',
    contributors: 19,
    status: 'Verified',
    accessible: true,
    rating: 4.4,
    fareHistory: [
      { month: 'Feb', fare: 150 },
      { month: 'Mar', fare: 150 },
      { month: 'Apr', fare: 150 },
      { month: 'May', fare: 150 },
      { month: 'Jun', fare: 150 },
      { month: 'Jul', fare: 150 },
    ],
  },
  {
    id: 'fare-006',
    routeNumber: 'SOU-16',
    routeName: 'Southern Star — Inter-City Link',
    agency: 'Southern Star SACCO',
    city: 'Nairobi, Kenya',
    mode: 'SACCO',
    origin: 'Nairobi CBD',
    destination: 'Kisumu Central',
    singleFare: 950,
    weeklyPass: null,
    monthlyPass: null,
    zone: 'Zone 2–4',
    peakFare: 950,
    offPeakFare: 950,
    distance: '352 km',
    lastVerified: '07/12/2026',
    contributors: 44,
    status: 'Verified',
    accessible: true,
    rating: 4.6,
    fareHistory: [
      { month: 'Feb', fare: 900 },
      { month: 'Mar', fare: 900 },
      { month: 'Apr', fare: 950 },
      { month: 'May', fare: 950 },
      { month: 'Jun', fare: 950 },
      { month: 'Jul', fare: 950 },
    ],
  },
  {
    id: 'fare-007',
    routeNumber: 'MAS-08',
    routeName: 'Mash East Express',
    agency: 'Mash East SACCO',
    city: 'Nairobi, Kenya',
    mode: 'Matatu',
    origin: 'Nairobi South Bus Station',
    destination: 'Eldoret Town',
    singleFare: 850,
    weeklyPass: 5950,
    monthlyPass: 22700,
    zone: 'Flat Fare',
    peakFare: 850,
    offPeakFare: 700,
    distance: '313 km',
    lastVerified: '06/15/2026',
    contributors: 5,
    status: 'Outdated',
    accessible: false,
    rating: 3.2,
    fareHistory: [
      { month: 'Feb', fare: 850 },
      { month: 'Mar', fare: 850 },
      { month: 'Apr', fare: 850 },
      { month: 'May', fare: 850 },
      { month: 'Jun', fare: 850 },
      { month: 'Jul', fare: 850 },
    ],
  },
  {
    id: 'fare-008',
    routeNumber: 'EME-15',
    routeName: 'Emali SACCO — Regional Service',
    agency: 'Emali SACCO',
    city: 'Nakuru, Kenya',
    mode: 'Bus',
    origin: 'Nakuru Central',
    destination: 'Kericho Town',
    singleFare: 550,
    weeklyPass: null,
    monthlyPass: 13200,
    zone: 'Flat Fare',
    peakFare: null,
    offPeakFare: null,
    distance: '100 km',
    lastVerified: '07/09/2026',
    contributors: 16,
    status: 'Verified',
    accessible: true,
    rating: 4.8,
    fareHistory: [
      { month: 'Feb', fare: 500 },
      { month: 'Mar', fare: 500 },
      { month: 'Apr', fare: 550 },
      { month: 'May', fare: 550 },
      { month: 'Jun', fare: 550 },
      { month: 'Jul', fare: 550 },
    ],
  },
  {
    id: 'fare-009',
    routeNumber: 'SCA-07',
    routeName: 'Scandinavian — Premium Coach',
    agency: 'Scandinavian SACCO',
    city: 'Nairobi, Kenya',
    mode: 'SACCO',
    origin: 'Nairobi Westlands',
    destination: 'Mombasa CBD',
    singleFare: 1400,
    weeklyPass: 9800,
    monthlyPass: 37300,
    zone: 'Zone 1',
    peakFare: 1600,
    offPeakFare: 1400,
    distance: '487 km',
    lastVerified: '07/01/2026',
    contributors: 29,
    status: 'Verified',
    accessible: true,
    rating: 4.3,
    fareHistory: [
      { month: 'Feb', fare: 1300 },
      { month: 'Mar', fare: 1300 },
      { month: 'Apr', fare: 1400 },
      { month: 'May', fare: 1400 },
      { month: 'Jun', fare: 1400 },
      { month: 'Jul', fare: 1400 },
    ],
  },
  {
    id: 'fare-010',
    routeNumber: 'GOL-12',
    routeName: 'Goldline Express — Long Distance',
    agency: 'Goldline SACCO',
    city: 'Nairobi, Kenya',
    mode: 'SACCO',
    origin: 'Nairobi Central',
    destination: 'Kitale Town',
    singleFare: 1100,
    weeklyPass: null,
    monthlyPass: null,
    zone: 'Zone 1–3',
    peakFare: 1200,
    offPeakFare: 1100,
    distance: '387 km',
    lastVerified: '07/13/2026',
    contributors: 33,
    status: 'Verified',
    accessible: true,
    rating: 4.1,
    fareHistory: [
      { month: 'Feb', fare: 1000 },
      { month: 'Mar', fare: 1000 },
      { month: 'Apr', fare: 1100 },
      { month: 'May', fare: 1100 },
      { month: 'Jun', fare: 1100 },
      { month: 'Jul', fare: 1100 },
    ],
  },
];

const MODES: (TransitMode | 'All')[] = ['All', 'SACCO', 'Matatu', 'Bus'];
const SORT_OPTIONS = [
  { id: 'sort-fare-asc', label: 'Fare: Low to High', value: 'fare-asc' },
  { id: 'sort-fare-desc', label: 'Fare: High to Low', value: 'fare-desc' },
  { id: 'sort-recent', label: 'Recently Verified', value: 'recent' },
  { id: 'sort-contributors', label: 'Most Contributors', value: 'contributors' },
  { id: 'sort-rating', label: 'Highest Rated', value: 'rating' },
];

export default function FareSearchContent() {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<TransitMode | 'All'>('All');
  const [sortBy, setSortBy] = useState('fare-asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set(['fare-001', 'fare-006']));

  const filtered = useMemo(() => {
    let results = mockFares.filter((f) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        f.routeName.toLowerCase().includes(q) ||
        f.routeNumber.toLowerCase().includes(q) ||
        f.origin.toLowerCase().includes(q) ||
        f.destination.toLowerCase().includes(q) ||
        f.agency.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q);
      const matchesMode = selectedMode === 'All' || f.mode === selectedMode;
      return matchesQuery && matchesMode;
    });

    results = [...results].sort((a, b) => {
      if (sortBy === 'fare-asc') return a.singleFare - b.singleFare;
      if (sortBy === 'fare-desc') return b.singleFare - a.singleFare;
      if (sortBy === 'contributors') return b.contributors - a.contributors;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
    return results;
  }, [query, selectedMode, sortBy]);

  const handleTrack = (fare: FareResult) => {
    setTrackedIds((prev) => {
      const next = new Set(prev);
      if (next.has(fare.id)) {
        next.delete(fare.id);
        toast.success(`Stopped tracking ${fare.routeName}`);
      } else {
        next.add(fare.id);
        toast.success(`Now tracking ${fare.routeName}`, {
          description: 'View changes in Fare Tracker',
        });
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fare Search</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search verified fare data for SACCOs, Matatus, and buses across Kenya.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
          <Clock size={12} />
          <span>Last synced: Jul 14, 2026 at 11:38 AM</span>
        </div>
      </div>

      {/* Search Bar + Filters */}
      <div className="bg-card border border-border rounded-xl shadow-card p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by route, stop, agency, or city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              showFilters
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted/50'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* Mode filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {MODES.map((mode) => (
            <button
              key={`mode-chip-${mode}`}
              onClick={() => setSelectedMode(mode)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                selectedMode === mode
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
              }`}
            >
              {mode}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-input border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="pt-3 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">City</label>
              <select className="w-full text-sm bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All Cities</option>
                <option>Nairobi, Kenya</option>
                <option>Mombasa, Kenya</option>
                <option>Kisumu, Kenya</option>
                <option>Nakuru, Kenya</option>
                <option>Eldoret, Kenya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Max Fare</label>
              <select className="w-full text-sm bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Any</option>
                <option>Under KES 200</option>
                <option>Under KES 500</option>
                <option>Under KES 1000</option>
                <option>Under KES 1500</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <select className="w-full text-sm bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All</option>
                <option>Verified Only</option>
                <option>Pending</option>
                <option>Outdated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Accessibility</label>
              <select className="w-full text-sm bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Any</option>
                <option>Accessible Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">{filtered.length}</span> routes
          {query && (
            <span>
              {' '}for <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
            </span>
          )}
        </p>
        {filtered.length !== mockFares.length && (
          <button
            onClick={() => { setQuery(''); setSelectedMode('All'); }}
            className="text-xs text-primary hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results List */}
      {filtered.length === 0 ? (
        <EmptySearchState onClear={() => { setQuery(''); setSelectedMode('All'); }} />
      ) : (
        <div className="space-y-3">
          {filtered.map((fare) => (
            <FareCard
              key={fare.id}
              fare={fare}
              expanded={expandedId === fare.id}
              tracked={trackedIds.has(fare.id)}
              onExpand={() => setExpandedId(expandedId === fare.id ? null : fare.id)}
              onTrack={() => handleTrack(fare)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Fare Card ────────────────────────────────────────────────────────────────
function FareCard({
  fare,
  expanded,
  tracked,
  onExpand,
  onTrack,
}: {
  fare: FareResult;
  expanded: boolean;
  tracked: boolean;
  onExpand: () => void;
  onTrack: () => void;
}) {
  return (
    <div
      className={`bg-card border rounded-xl shadow-card transition-all duration-200 overflow-hidden ${
        fare.status === 'Outdated' ?'border-[color:var(--status-outdated)] border-l-4' :'border-border hover:shadow-card-hover'
      }`}
    >
      {/* Main Row */}
      <div
        className="flex items-start gap-4 p-4 cursor-pointer"
        onClick={onExpand}
      >
        {/* Route Number */}
        <div className="shrink-0 w-14 h-14 bg-secondary rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-primary">{fare.routeNumber}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">route</span>
        </div>

        {/* Route Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground truncate">{fare.routeName}</h3>
            <ModeBadge mode={fare.mode} />
            <StatusBadge status={fare.status} />
            {fare.accessible && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                ♿ Accessible
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">{fare.agency}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin size={11} />
            <span className="truncate">
              {fare.origin} → {fare.destination}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={11} />
              {fare.contributors} contributors
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Verified {fare.lastVerified}
            </span>
            <span className="flex items-center gap-1">
              <Star size={11} className="text-accent" />
              {fare.rating.toFixed(1)}
            </span>
            <span>{fare.distance}</span>
            <span>{fare.city}</span>
          </div>
        </div>

        {/* Fare + Actions */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="fare-value text-2xl text-foreground">KES {fare.singleFare.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">single trip</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onTrack(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 active:scale-95 ${
                tracked
                  ? 'bg-primary/10 text-primary border-primary/30' :'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
              }`}
            >
              <BookmarkPlus size={12} />
              {tracked ? 'Tracked' : 'Track'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-4 fade-in">
          {fare.status === 'Outdated' && (
            <div className="flex items-start gap-2 bg-[color:var(--status-outdated-bg)] border border-[color:var(--status-outdated)] rounded-lg p-3 mb-4 text-xs text-[color:var(--status-outdated)]">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>
                This fare data may be outdated — last verified on {fare.lastVerified}. Consider{' '}
                <a href="/fare-contribution" className="underline font-medium">
                  contributing updated fare info
                </a>
                .
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FareDetailBox label="Single Trip" value={`KES ${fare.singleFare.toFixed(0)}`} />
            <FareDetailBox
              label="Weekly Pass"
              value={fare.weeklyPass ? `KES ${fare.weeklyPass.toFixed(0)}` : 'N/A'}
            />
            <FareDetailBox
              label="Monthly Pass"
              value={fare.monthlyPass ? `KES ${fare.monthlyPass.toFixed(0)}` : 'N/A'}
            />
            <FareDetailBox label="Zone" value={fare.zone} />
            {fare.peakFare && (
              <FareDetailBox label="Peak Fare" value={`KES ${fare.peakFare.toFixed(0)}`} highlight />
            )}
            {fare.offPeakFare && fare.peakFare !== fare.offPeakFare && (
              <FareDetailBox
                label="Off-Peak Fare"
                value={`KES ${fare.offPeakFare.toFixed(0)}`}
              />
            )}
            <FareDetailBox label="Distance" value={fare.distance} />
            <FareDetailBox label="Agency" value={fare.agency} />
          </div>

          {/* Sparkline history */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Fare History (6 months)
            </p>
            <MiniSparkline data={fare.fareHistory} />
          </div>
        </div>
      )}
    </div>
  );
}

function FareDetailBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        highlight ? 'bg-accent/10 border border-accent/30' : 'bg-muted/40 border border-border'
      }`}
    >
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className={`fare-value text-base ${highlight ? 'text-accent-foreground' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}

// ─── Sparkline (client chart) ─────────────────────────────────────────────────
function MiniSparkline({ data }: { data: { month: string; fare: number }[] }) {
  const min = Math.min(...data.map((d) => d.fare));
  const max = Math.max(...data.map((d) => d.fare));
  const range = max - min || 1;
  const w = 300;
  const h = 48;
  const pad = 8;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.fare - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="flex items-end gap-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-48 h-10 shrink-0" aria-hidden="true">
        <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1)) * (w - pad * 2);
          const y = h - pad - ((d.fare - min) / range) * (h - pad * 2);
          return (
            <circle key={`spark-${i}`} cx={x} cy={y} r="2.5" fill="var(--primary)" />
          );
        })}
      </svg>
      <div className="flex gap-3">
        {data.map((d) => (
          <div key={`spark-label-${d.month}`} className="text-center">
            <div className="fare-value text-xs text-foreground">KES {d.fare.toFixed(0)}</div>
            <div className="text-[10px] text-muted-foreground">{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptySearchState({ onClear }: { onClear: () => void }) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-16 flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Search size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">No routes found</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        No fare data matches your search. Try a different route name, stop, city, or agency — or contribute new fare data.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          Clear Search
        </button>
        <a
          href="/fare-contribution"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Contribute Fare Data
        </a>
      </div>
    </div>
  );
}