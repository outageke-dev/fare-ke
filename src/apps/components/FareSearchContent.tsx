'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, AlertCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface FareReport {
  id: string;
  operator: string;
  fare: number;
  reportedAt: string;
  traffic?: string;
  weather?: string;
}

interface FareData {
  from: string;
  to: string;
  currentFare: number;
  confidence: 'High' | 'Medium' | 'Low';
  reportCount: number;
  lastUpdated: string;
  lowestToday: number;
  highestToday: number;
  reports: FareReport[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockRoutes = [
  { from: 'CBD', to: 'Kangemi' },
  { from: 'CBD', to: 'Kasarani' },
  { from: 'CBD', to: 'Karen' },
  { from: 'Kasarani', to: 'CBD' },
  { from: 'Kilimani', to: 'CBD' },
];

const mockRecentUpdates: FareReport[] = [
  { id: '1', operator: 'Super Metro', fare: 150, reportedAt: '2 minutes ago', traffic: 'Medium' },
  { id: '2', operator: 'City Shuttle', fare: 150, reportedAt: '5 minutes ago', traffic: 'Low' },
  { id: '3', operator: 'Metrotrans', fare: 160, reportedAt: '8 minutes ago', weather: 'Sunny' },
  { id: '4', operator: 'Forward Travelers', fare: 150, reportedAt: '12 minutes ago' },
  { id: '5', operator: 'KBS', fare: 150, reportedAt: '15 minutes ago' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function FareSearchContent() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState<FareData | null>(null);
  const [showReportingForm, setShowReportingForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    from: '',
    to: '',
    operator: '',
    fare: '',
  });
  const [reportOptional, setReportOptional] = useState({
    traffic: '',
    weather: '',
    notes: '',
    showOptional: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      toast.error('Please enter both locations');
      return;
    }

    // Mock results
    const mockResult: FareData = {
      from,
      to,
      currentFare: 150,
      confidence: 'High',
      reportCount: 18,
      lastUpdated: '3 minutes ago',
      lowestToday: 140,
      highestToday: 180,
      reports: [
        { id: '1', operator: 'Super Metro', fare: 150, reportedAt: '2 minutes ago' },
        { id: '2', operator: 'City Shuttle', fare: 150, reportedAt: '5 minutes ago' },
        { id: '3', operator: 'Metrotrans', fare: 160, reportedAt: '8 minutes ago' },
        { id: '4', operator: 'Forward Travelers', fare: 150, reportedAt: '12 minutes ago' },
        { id: '5', operator: 'KBS', fare: 150, reportedAt: '15 minutes ago' },
      ],
    };

    setResults(mockResult);
    setShowReportingForm(false);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportForm.from || !reportForm.to || !reportForm.operator || !reportForm.fare) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);

    // Show thank you
    toast.success('Thank you. Your report helps thousands of commuters.', {
      duration: 4000,
    });

    // Reset and return to results
    setReportForm({ from: '', to: '', operator: '', fare: '' });
    setReportOptional({ traffic: '', weather: '', notes: '', showOptional: false });
    setShowReportingForm(false);
  };

  // ─── HOME SCREEN ──────────────────────────────────────────────────────────
  if (!results && !showReportingForm) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Nauli</h1>
          <p className="text-sm text-muted-foreground">
            Real-time matatu fares in Kenya. Know what you'll actually pay before you board.
          </p>
        </header>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="space-y-4" aria-label="Find matatu fare">
          <section className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Where are you travelling?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="from-location" className="block text-xs font-medium text-muted-foreground mb-2">
                  FROM <span aria-label="required">*</span>
                </label>
                <input
                  id="from-location"
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. CBD"
                  aria-label="Departure location"
                  required
                  className="w-full px-4 py-3 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="to-location" className="block text-xs font-medium text-muted-foreground mb-2">
                  TO <span aria-label="required">*</span>
                </label>
                <input
                  id="to-location"
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Kangemi"
                  aria-label="Destination location"
                  required
                  className="w-full px-4 py-3 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              aria-label="Search for matatu fares"
              className="w-full px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95"
            >
              Find Fare
            </button>
          </section>
        </form>

        {/* Popular Routes */}
        <section className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4" aria-label="Popular routes">
          <h2 className="text-base font-semibold text-foreground">Popular Routes</h2>
          <div className="space-y-2">
            {mockRoutes.map((route, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    form?.dispatchEvent(new Event('submit', { bubbles: true }));
                  }, 0);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left text-sm"
              >
                <span className="text-foreground font-medium">
                  {route.from} → {route.to}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Fare Updates */}
        <section className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4" aria-label="Recent fare updates">
          <h2 className="text-base font-semibold text-foreground">Recent Fare Updates</h2>
          <div className="space-y-3" role="list">
            {mockRecentUpdates.map((update) => (
              <article key={update.id} className="flex items-start justify-between px-3 py-2 rounded-lg bg-muted/30 text-sm" role="listitem">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{update.operator}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span aria-label="Fare">KES {update.fare}</span> • <time>{update.reportedAt}</time>
                    {update.traffic && ` • ${update.traffic} traffic`}
                    {update.weather && ` • ${update.weather}`}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ─── RESULTS SCREEN ────────────────────────────────────────────────────────
  if (results && !showReportingForm) {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <nav aria-label="Page navigation">
          <button
            onClick={() => {
              setResults(null);
              setFrom('');
              setTo('');
            }}
            className="text-sm text-primary font-medium hover:underline"
            aria-label="Return to fare search"
          >
            ← Back to search
          </button>
        </nav>

        {/* Route header */}
        <header>
          <h1 className="text-3xl font-bold text-foreground">
            {results.from} <span aria-hidden="true">→</span> {results.to}
          </h1>
        </header>

        {/* Current Fare Card */}
        <section className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4" aria-label="Current fare information">
          <div className="space-y-2">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Estimated Current Fare
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground" aria-label={`Current fare: ${results.currentFare} Kenya shillings`}>
                KES {results.currentFare}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border" role="group" aria-label="Fare statistics">
            <div>
              <h3 className="text-xs text-muted-foreground mb-1 font-semibold">Confidence</h3>
              <p className="text-sm font-semibold text-foreground">{results.confidence}</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1 font-semibold">Based on</h3>
              <p className="text-sm font-semibold text-foreground" aria-label={`${results.reportCount} community reports`}>
                {results.reportCount} reports
              </p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1 font-semibold">Updated</h3>
              <p className="text-sm font-semibold text-foreground">
                <time>{results.lastUpdated}</time>
              </p>
            </div>
          </div>
        </section>

        {/* Fare Range */}
        <section className="grid grid-cols-2 gap-4" aria-label="Fare range today">
          <div className="bg-card border border-border rounded-xl shadow-card p-4">
            <h3 className="text-xs text-muted-foreground mb-2 font-semibold">Lowest today</h3>
            <p className="text-2xl font-bold text-foreground" aria-label={`Minimum fare: ${results.lowestToday} Kenya shillings`}>
              KES {results.lowestToday}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-card p-4">
            <h3 className="text-xs text-muted-foreground mb-2 font-semibold">Highest today</h3>
            <p className="text-2xl font-bold text-foreground" aria-label={`Maximum fare: ${results.highestToday} Kenya shillings`}>
              KES {results.highestToday}
            </p>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4" aria-label="Recent community reports">
          <h2 className="text-base font-semibold text-foreground">Recent Reports</h2>
          <div className="space-y-3" role="list">
            {results.reports.map((report) => (
              <article key={report.id} className="flex items-start justify-between px-3 py-2 rounded-lg bg-muted/30" role="listitem">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{report.operator}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />
                    <time>{report.reportedAt}</time>
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground shrink-0 ml-2" aria-label={`Reported fare: ${report.fare} Kenya shillings`}>
                  KES {report.fare}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Report Button */}
        <button
          onClick={() => {
            setShowReportingForm(true);
            setReportForm({ from: results.from, to: results.to, operator: '', fare: '' });
          }}
          className="w-full px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95"
        >
          Report Fare
        </button>
      </div>
    );
  }

  // ─── REPORTING FORM ───────────────────────────────────────────────────────
  if (showReportingForm) {
    const operators = ['Super Metro', 'Metrotrans', 'Forward Travelers', 'KBS', 'City Shuttle', 'Other'];

    return (
      <div className="space-y-6 max-w-2xl">
        {/* Back button */}
        <nav aria-label="Page navigation">
          <button
            onClick={() => {
              setShowReportingForm(false);
              setReportForm({ from: '', to: '', operator: '', fare: '' });
            }}
            className="text-sm text-primary font-medium hover:underline"
            aria-label="Return to fare results"
          >
            ← Back to results
          </button>
        </nav>

        {/* Form */}
        <form onSubmit={handleReportSubmit} className="bg-card border border-border rounded-xl shadow-card p-6 space-y-6" aria-label="Report matatu fare">
          <header>
            <h1 className="text-3xl font-bold text-foreground">Report Fare</h1>
            <p className="text-sm text-muted-foreground mt-1">Help us keep fares accurate and current</p>
          </header>

          {/* Route fields */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Route information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="report-from" className="block text-xs font-medium text-muted-foreground mb-2">
                  FROM <span aria-label="required">*</span>
                </label>
                <input
                  id="report-from"
                  type="text"
                  value={reportForm.from}
                  onChange={(e) => setReportForm({ ...reportForm, from: e.target.value })}
                  placeholder="e.g. CBD"
                  aria-label="Departure location"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="report-to" className="block text-xs font-medium text-muted-foreground mb-2">
                  TO <span aria-label="required">*</span>
                </label>
                <input
                  id="report-to"
                  type="text"
                  value={reportForm.to}
                  onChange={(e) => setReportForm({ ...reportForm, to: e.target.value })}
                  placeholder="e.g. Kangemi"
                  aria-label="Destination location"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </fieldset>

          {/* Operator */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium text-muted-foreground mb-2 block">
              Operator <span aria-label="required">*</span>
            </legend>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="group" aria-label="Select matatu operator">
              {operators.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setReportForm({ ...reportForm, operator: op })}
                  aria-pressed={reportForm.operator === op}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    reportForm.operator === op
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-muted/40 border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Fare */}
          <fieldset className="space-y-2">
            <legend className="sr-only">Fare information</legend>
            <label htmlFor="fare-paid" className="block text-xs font-medium text-muted-foreground mb-2">
              Fare Paid (KES) <span aria-label="required">*</span>
            </label>
            <input
              id="fare-paid"
              type="number"
              value={reportForm.fare}
              onChange={(e) => setReportForm({ ...reportForm, fare: e.target.value })}
              placeholder="e.g. 150"
              aria-label="Amount paid for fare in Kenya shillings"
              required
              min="0"
              className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </fieldset>

          {/* Optional Fields */}
          <details className="border-t border-border pt-6 space-y-4 group">
            <summary className="text-sm font-medium text-primary hover:underline cursor-pointer list-none">
              <span className="inline-block mr-2">{reportOptional.showOptional ? '▼' : '▶'}</span>
              Optional details
            </summary>

            <fieldset className="space-y-4 animate-in fade-in duration-200">
              {/* Traffic */}
              <div>
                <legend className="text-xs font-medium text-muted-foreground mb-2 block">Traffic</legend>
                <div className="flex gap-2" role="group" aria-label="Traffic level">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setReportOptional({ ...reportOptional, traffic: level })}
                      aria-pressed={reportOptional.traffic === level}
                      className={`px-3 py-1.5 rounded text-sm font-medium border transition-all ${
                        reportOptional.traffic === level
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-muted/40 border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div>
                <legend className="text-xs font-medium text-muted-foreground mb-2 block">Weather</legend>
                <div className="flex gap-2" role="group" aria-label="Weather conditions">
                  {['Sunny', 'Rain'].map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setReportOptional({ ...reportOptional, weather: condition })}
                      aria-pressed={reportOptional.weather === condition}
                      className={`px-3 py-1.5 rounded text-sm font-medium border transition-all ${
                        reportOptional.weather === condition
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-muted/40 border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="additional-notes" className="block text-xs font-medium text-muted-foreground mb-2">
                  Notes
                </label>
                <textarea
                  id="additional-notes"
                  value={reportOptional.notes}
                  onChange={(e) => setReportOptional({ ...reportOptional, notes: e.target.value })}
                  placeholder="Any additional details that affect the fare..."
                  aria-label="Additional notes about the fare"
                  className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={3}
                />
              </div>
            </fieldset>
          </details>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            aria-label={submitting ? 'Submitting your fare report' : 'Submit your fare report'}
            className="w-full px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    );
  }
}
