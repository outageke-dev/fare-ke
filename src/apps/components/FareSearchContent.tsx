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
    routeNumber: 'M1',
    routeName: 'Red Line — Downtown Express',
    agency: 'Metro Transit Authority',
    city: 'Chicago, IL',
    mode: 'Metro',
    origin: 'O\'Hare International Airport',
    destination: 'Loop / Washington',
    singleFare: 2.50,
    weeklyPass: 28.00,
    monthlyPass: 105.00,
    zone: 'Zone A–B',
    peakFare: 2.50,
    offPeakFare: 2.50,
    distance: '17.4 mi',
    lastVerified: '07/10/2026',
    contributors: 24,
    status: 'Verified',
    accessible: true,
    rating: 4.7,
    fareHistory: [
      { month: 'Feb', fare: 2.25 },
      { month: 'Mar', fare: 2.25 },
      { month: 'Apr', fare: 2.50 },
      { month: 'May', fare: 2.50 },
      { month: 'Jun', fare: 2.50 },
      { month: 'Jul', fare: 2.50 },
    ],
  },
  {
    id: 'fare-002',
    routeNumber: '22',
    routeName: 'Clark Street Bus',
    agency: 'Chicago Transit Authority',
    city: 'Chicago, IL',
    mode: 'Bus',
    origin: 'Howard Terminal',
    destination: 'Navy Pier',
    singleFare: 2.25,
    weeklyPass: 28.00,
    monthlyPass: 105.00,
    zone: 'Flat Fare',
    peakFare: 2.25,
    offPeakFare: 2.25,
    distance: '8.2 mi',
    lastVerified: '07/08/2026',
    contributors: 11,
    status: 'Verified',
    accessible: true,
    rating: 4.2,
    fareHistory: [
      { month: 'Feb', fare: 2.00 },
      { month: 'Mar', fare: 2.00 },
      { month: 'Apr', fare: 2.25 },
      { month: 'May', fare: 2.25 },
      { month: 'Jun', fare: 2.25 },
      { month: 'Jul', fare: 2.25 },
    ],
  },
  {
    id: 'fare-003',
    routeNumber: 'NJ-123',
    routeName: 'Northeast Corridor — Express',
    agency: 'NJ Transit Rail',
    city: 'New York Metro Area',
    mode: 'Train',
    origin: 'Newark Penn Station',
    destination: 'New York Penn Station',
    singleFare: 6.75,
    weeklyPass: 58.00,
    monthlyPass: 199.00,
    zone: 'Zone 3',
    peakFare: 8.50,
    offPeakFare: 6.75,
    distance: '9.1 mi',
    lastVerified: '07/11/2026',
    contributors: 38,
    status: 'Verified',
    accessible: true,
    rating: 4.5,
    fareHistory: [
      { month: 'Feb', fare: 6.25 },
      { month: 'Mar', fare: 6.25 },
      { month: 'Apr', fare: 6.75 },
      { month: 'May', fare: 6.75 },
      { month: 'Jun', fare: 6.75 },
      { month: 'Jul', fare: 6.75 },
    ],
  },
  {
    id: 'fare-004',
    routeNumber: 'L-Green',
    routeName: 'Green Line — Midway',
    agency: 'Chicago Transit Authority',
    city: 'Chicago, IL',
    mode: 'Metro',
    origin: 'Harlem/Lake',
    destination: 'Midway Airport',
    singleFare: 2.50,
    weeklyPass: 28.00,
    monthlyPass: 105.00,
    zone: 'Zone A',
    peakFare: 2.50,
    offPeakFare: 2.50,
    distance: '14.6 mi',
    lastVerified: '06/28/2026',
    contributors: 7,
    status: 'Pending',
    accessible: true,
    rating: 3.9,
    fareHistory: [
      { month: 'Feb', fare: 2.25 },
      { month: 'Mar', fare: 2.50 },
      { month: 'Apr', fare: 2.50 },
      { month: 'May', fare: 2.50 },
      { month: 'Jun', fare: 2.50 },
      { month: 'Jul', fare: 2.50 },
    ],
  },
  {
    id: 'fare-005',
    routeNumber: 'T-Blue',
    routeName: 'Blue Line — Airport',
    agency: 'MBTA',
    city: 'Boston, MA',
    mode: 'Metro',
    origin: 'Bowdoin',
    destination: 'Logan Airport (Blue Line)',
    singleFare: 2.40,
    weeklyPass: 22.50,
    monthlyPass: 90.00,
    zone: 'Flat Fare',
    peakFare: null,
    offPeakFare: null,
    distance: '5.8 mi',
    lastVerified: '07/05/2026',
    contributors: 19,
    status: 'Verified',
    accessible: true,
    rating: 4.4,
    fareHistory: [
      { month: 'Feb', fare: 2.40 },
      { month: 'Mar', fare: 2.40 },
      { month: 'Apr', fare: 2.40 },
      { month: 'May', fare: 2.40 },
      { month: 'Jun', fare: 2.40 },
      { month: 'Jul', fare: 2.40 },
    ],
  },
  {
    id: 'fare-006',
    routeNumber: 'BART-OAK',
    routeName: 'Oakland — SF Transbay',
    agency: 'Bay Area Rapid Transit',
    city: 'San Francisco Bay Area',
    mode: 'Train',
    origin: 'Oakland 12th St / City Center',
    destination: 'Embarcadero, San Francisco',
    singleFare: 4.30,
    weeklyPass: null,
    monthlyPass: null,
    zone: 'Zone 2–4',
    peakFare: 4.30,
    offPeakFare: 4.30,
    distance: '8.9 mi',
    lastVerified: '07/12/2026',
    contributors: 44,
    status: 'Verified',
    accessible: true,
    rating: 4.6,
    fareHistory: [
      { month: 'Feb', fare: 3.90 },
      { month: 'Mar', fare: 3.90 },
      { month: 'Apr', fare: 4.10 },
      { month: 'May', fare: 4.10 },
      { month: 'Jun', fare: 4.30 },
      { month: 'Jul', fare: 4.30 },
    ],
  },
  {
    id: 'fare-007',
    routeNumber: '150',
    routeName: 'Archer Express Bus',
    agency: 'Chicago Transit Authority',
    city: 'Chicago, IL',
    mode: 'Bus',
    origin: 'Midway Airport',
    destination: 'Downtown Chicago / State & Madison',
    singleFare: 2.25,
    weeklyPass: 28.00,
    monthlyPass: 105.00,
    zone: 'Flat Fare',
    peakFare: 2.25,
    offPeakFare: 2.25,
    distance: '11.3 mi',
    lastVerified: '06/15/2026',
    contributors: 5,
    status: 'Outdated',
    accessible: false,
    rating: 3.2,
    fareHistory: [
      { month: 'Feb', fare: 2.25 },
      { month: 'Mar', fare: 2.25 },
      { month: 'Apr', fare: 2.25 },
      { month: 'May', fare: 2.25 },
      { month: 'Jun', fare: 2.25 },
      { month: 'Jul', fare: 2.25 },
    ],
  },
  {
    id: 'fare-008',
    routeNumber: 'SF-F',
    routeName: 'F Market & Wharves Streetcar',
    agency: 'San Francisco Municipal Railway',
    city: 'San Francisco, CA',
    mode: 'Tram',
    origin: 'Castro / Market',
    destination: 'Fisherman\'s Wharf',
    singleFare: 3.00,
    weeklyPass: null,
    monthlyPass: 98.00,
    zone: 'Flat Fare',
    peakFare: null,
    offPeakFare: null,
    distance: '3.4 mi',
    lastVerified: '07/09/2026',
    contributors: 16,
    status: 'Verified',
    accessible: true,
    rating: 4.8,
    fareHistory: [
      { month: 'Feb', fare: 2.75 },
      { month: 'Mar', fare: 2.75 },
      { month: 'Apr', fare: 3.00 },
      { month: 'May', fare: 3.00 },
      { month: 'Jun', fare: 3.00 },
      { month: 'Jul', fare: 3.00 },
    ],
  },
  {
    id: 'fare-009',
    routeNumber: 'LIRR-JAM',
    routeName: 'Jamaica — Penn Station',
    agency: 'Long Island Rail Road',
    city: 'New York Metro Area',
    mode: 'Train',
    origin: 'Jamaica Station',
    destination: 'New York Penn Station',
    singleFare: 5.50,
    weeklyPass: 45.00,
    monthlyPass: 162.00,
    zone: 'Zone 1',
    peakFare: 7.25,
    offPeakFare: 5.50,
    distance: '12.6 mi',
    lastVerified: '07/01/2026',
    contributors: 29,
    status: 'Verified',
    accessible: true,
    rating: 4.3,
    fareHistory: [
      { month: 'Feb', fare: 5.00 },
      { month: 'Mar', fare: 5.00 },
      { month: 'Apr', fare: 5.50 },
      { month: 'May', fare: 5.50 },
      { month: 'Jun', fare: 5.50 },
      { month: 'Jul', fare: 5.50 },
    ],
  },
  {
    id: 'fare-010',
    routeNumber: 'DC-RED',
    routeName: 'Red Line — Shady Grove to Glenmont',
    agency: 'Washington Metro (WMATA)',
    city: 'Washington, D.C.',
    mode: 'Metro',
    origin: 'Shady Grove',
    destination: 'Union Station',
    singleFare: 3.85,
    weeklyPass: null,
    monthlyPass: null,
    zone: 'Zone 1–3',
    peakFare: 4.80,
    offPeakFare: 3.85,
    distance: '22.1 mi',
    lastVerified: '07/13/2026',
    contributors: 33,
    status: 'Verified',
    accessible: true,
    rating: 4.1,
    fareHistory: [
      { month: 'Feb', fare: 3.65 },
      { month: 'Mar', fare: 3.65 },
      { month: 'Apr', fare: 3.85 },
      { month: 'May', fare: 3.85 },
      { month: 'Jun', fare: 3.85 },
      { month: 'Jul', fare: 3.85 },
    ],
  },
];

const MODES: (TransitMode | 'All')[] = ['All', 'Bus', 'Train', 'Metro', 'Tram'];
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
            Search verified fare data for bus, train, metro, and tram routes across the US.
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
                <option>Chicago, IL</option>
                <option>New York Metro Area</option>
                <option>Boston, MA</option>
                <option>San Francisco Bay Area</option>
                <option>Washington, D.C.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Max Fare</label>
              <select className="w-full text-sm bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Any</option>
                <option>Under $2.00</option>
                <option>Under $3.00</option>
                <option>Under $5.00</option>
                <option>Under $10.00</option>
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
            <div className="fare-value text-2xl text-foreground">${fare.singleFare.toFixed(2)}</div>
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
            <FareDetailBox label="Single Trip" value={`$${fare.singleFare.toFixed(2)}`} />
            <FareDetailBox
              label="Weekly Pass"
              value={fare.weeklyPass ? `$${fare.weeklyPass.toFixed(2)}` : 'N/A'}
            />
            <FareDetailBox
              label="Monthly Pass"
              value={fare.monthlyPass ? `$${fare.monthlyPass.toFixed(2)}` : 'N/A'}
            />
            <FareDetailBox label="Zone" value={fare.zone} />
            {fare.peakFare && (
              <FareDetailBox label="Peak Fare" value={`$${fare.peakFare.toFixed(2)}`} highlight />
            )}
            {fare.offPeakFare && fare.peakFare !== fare.offPeakFare && (
              <FareDetailBox
                label="Off-Peak Fare"
                value={`$${fare.offPeakFare.toFixed(2)}`}
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
            <div className="fare-value text-xs text-foreground">${d.fare.toFixed(2)}</div>
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