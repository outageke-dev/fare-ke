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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nauli</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Estimated matatu fares in real time
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Where are you travelling?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">FROM</label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. CBD"
                  className="w-full px-4 py-3 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">TO</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Kangemi"
                  className="w-full px-4 py-3 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95"
            >
              Find Fare
            </button>
          </div>
        </form>

        {/* Popular Routes */}
        <div className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Popular Routes</h2>
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
        <div className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Fare Updates</h2>
          <div className="space-y-3">
            {mockRecentUpdates.map((update) => (
              <div key={update.id} className="flex items-start justify-between px-3 py-2 rounded-lg bg-muted/30 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{update.operator}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    KES {update.fare} • {update.reportedAt}
                    {update.traffic && ` • ${update.traffic} traffic`}
                    {update.weather && ` • ${update.weather}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ────────────────────────────────────────────────────────
  if (results && !showReportingForm) {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => {
            setResults(null);
            setFrom('');
            setTo('');
          }}
          className="text-sm text-primary font-medium hover:underline"
        >
          ← Back to search
        </button>

        {/* Route header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {results.from} → {results.to}
          </h1>
        </div>

        {/* Current Fare Card */}
        <div className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Estimated Current Fare
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">KES {results.currentFare}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Confidence</p>
              <p className="text-sm font-semibold text-foreground">{results.confidence}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Based on</p>
              <p className="text-sm font-semibold text-foreground">{results.reportCount} reports</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Updated</p>
              <p className="text-sm font-semibold text-foreground">{results.lastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Fare Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl shadow-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Lowest today</p>
            <p className="text-2xl font-bold text-foreground">KES {results.lowestToday}</p>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Highest today</p>
            <p className="text-2xl font-bold text-foreground">KES {results.highestToday}</p>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-card border border-border rounded-xl shadow-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Reports</h2>
          <div className="space-y-3">
            {results.reports.map((report) => (
              <div key={report.id} className="flex items-start justify-between px-3 py-2 rounded-lg bg-muted/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{report.operator}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock size={12} />
                    {report.reportedAt}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground shrink-0 ml-2">KES {report.fare}</p>
              </div>
            ))}
          </div>
        </div>

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
        <button
          onClick={() => {
            setShowReportingForm(false);
            setReportForm({ from: '', to: '', operator: '', fare: '' });
          }}
          className="text-sm text-primary font-medium hover:underline"
        >
          ← Back to results
        </button>

        {/* Form */}
        <form onSubmit={handleReportSubmit} className="bg-card border border-border rounded-xl shadow-card p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Report Fare</h1>
            <p className="text-sm text-muted-foreground mt-1">Help us keep fares accurate</p>
          </div>

          {/* Route fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">FROM *</label>
              <input
                type="text"
                value={reportForm.from}
                onChange={(e) => setReportForm({ ...reportForm, from: e.target.value })}
                placeholder="e.g. CBD"
                className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">TO *</label>
              <input
                type="text"
                value={reportForm.to}
                onChange={(e) => setReportForm({ ...reportForm, to: e.target.value })}
                placeholder="e.g. Kangemi"
                className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Operator */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Operator *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {operators.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setReportForm({ ...reportForm, operator: op })}
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
          </div>

          {/* Fare */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Fare Paid (KES) *</label>
            <input
              type="number"
              value={reportForm.fare}
              onChange={(e) => setReportForm({ ...reportForm, fare: e.target.value })}
              placeholder="e.g. 150"
              className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Optional Fields */}
          <div className="border-t border-border pt-6 space-y-4">
            <button
              type="button"
              onClick={() =>
                setReportOptional({ ...reportOptional, showOptional: !reportOptional.showOptional })
              }
              className="text-sm font-medium text-primary hover:underline"
            >
              {reportOptional.showOptional ? '▼ Hide' : '▶ Show'} optional details
            </button>

            {reportOptional.showOptional && (
              <div className="space-y-4">
                {/* Traffic */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Traffic</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setReportOptional({ ...reportOptional, traffic: level })}
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
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Weather</label>
                  <div className="flex gap-2">
                    {['Sunny', 'Rain'].map((condition) => (
                      <button
                        key={condition}
                        type="button"
                        onClick={() => setReportOptional({ ...reportOptional, weather: condition })}
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
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Notes</label>
                  <textarea
                    value={reportOptional.notes}
                    onChange={(e) => setReportOptional({ ...reportOptional, notes: e.target.value })}
                    placeholder="Any additional details..."
                    className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    );
  }
}
