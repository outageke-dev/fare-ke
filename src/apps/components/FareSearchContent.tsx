'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import FareDisplay from '@/components/ui/FareDisplay';
import ListItem from '@/components/ui/ListItem';

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
  averageFare: number;
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
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      toast.error('Please enter both locations');
      return;
    }

    const mockResult: FareData = {
      from,
      to,
      currentFare: 150,
      confidence: 'High',
      reportCount: 18,
      lastUpdated: '3 minutes ago',
      lowestToday: 140,
      highestToday: 180,
      averageFare: 152,
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

    toast.success('Thank you. Your report helps commuters across Kenya.', {
      duration: 4000,
    });

    setReportForm({ from: '', to: '', operator: '', fare: '' });
    setReportOptional({ traffic: '', weather: '', notes: '' });
    setShowReportingForm(false);
  };

  // ─── HOME SCREEN ──────────────────────────────────────────────────────────
  if (!results && !showReportingForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-2 py-4">
          <h1>Nauli</h1>
          <p className="text-muted-foreground">
            Real-time matatu fares. Know what you'll pay before you board.
          </p>
        </header>

        {/* Search */}
        <form onSubmit={handleSearch} className="space-y-6">
          <Section title="Where are you travelling?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="from"
                label="FROM"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="CBD"
                required
              />
              <Input
                id="to"
                label="TO"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Kangemi"
                required
              />
            </div>
            <Button variant="primary" size="lg" type="submit" className="w-full">
              Find Fare
            </Button>
          </Section>
        </form>

        {/* Popular Routes */}
        <Section title="Popular Routes" subtitle="Quick links to common journeys">
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
                className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary transition-colors"
              >
                <p className="text-sm font-medium text-foreground">
                  {route.from} → {route.to}
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* Recent Updates */}
        <Section title="Recent Fare Updates" subtitle="Latest reports from commuters">
          <div className="space-y-2">
            {mockRecentUpdates.map((update) => (
              <ListItem
                key={update.id}
                primary={update.operator}
                secondary={
                  <time>{update.reportedAt}</time>
                }
                meta={`KES ${update.fare}`}
              />
            ))}
          </div>
        </Section>
      </div>
    );
  }

  // ─── RESULTS SCREEN ────────────────────────────────────────────────────────
  if (results && !showReportingForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => {
              setResults(null);
              setFrom('');
              setTo('');
            }}
          >
            ← Back
          </Button>
          <h1 className="mt-2">
            {results.from} → {results.to}
          </h1>
        </div>

        {/* Current Fare */}
        <div className="space-y-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase mb-3">
              Estimated Current Fare
            </p>
            <FareDisplay amount={results.currentFare} size="lg" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <Badge variant={results.confidence === 'High' ? 'success' : 'neutral'}>
                {results.confidence}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Based on</p>
              <p className="text-sm font-semibold">{results.reportCount} reports</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Updated</p>
              <p className="text-sm font-semibold">{results.lastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Fare Range */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Lowest Today</p>
            <FareDisplay amount={results.lowestToday} size="sm" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Average</p>
            <FareDisplay amount={results.averageFare} size="sm" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Highest Today</p>
            <FareDisplay amount={results.highestToday} size="sm" />
          </div>
        </div>

        {/* Recent Reports */}
        <Section title="Recent Reports" subtitle="What others are reporting right now">
          <div className="space-y-2">
            {results.reports.map((report) => (
              <ListItem
                key={report.id}
                primary={report.operator}
                secondary={<time>{report.reportedAt}</time>}
                meta={`KES ${report.fare}`}
              />
            ))}
          </div>
        </Section>

        {/* Report Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setShowReportingForm(true);
            setReportForm({ from: results.from, to: results.to, operator: '', fare: '' });
          }}
          className="w-full"
        >
          Report Fare
        </Button>
      </div>
    );
  }

  // ─── REPORTING FORM ───────────────────────────────────────────────────────
  if (showReportingForm) {
    const operators = ['Super Metro', 'Metrotrans', 'Forward Travelers', 'City Shuttle', 'KBS', '2NK', 'Other'];

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => {
              setShowReportingForm(false);
              setReportForm({ from: '', to: '', operator: '', fare: '' });
            }}
          >
            ← Back
          </Button>
          <div className="mt-4">
            <h1>Report Fare</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Help us keep fares accurate
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleReportSubmit} className="space-y-6">
          {/* Route */}
          <Section title="Route">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="report-from"
                label="FROM"
                value={reportForm.from}
                onChange={(e) => setReportForm({ ...reportForm, from: e.target.value })}
                placeholder="CBD"
                required
              />
              <Input
                id="report-to"
                label="TO"
                value={reportForm.to}
                onChange={(e) => setReportForm({ ...reportForm, to: e.target.value })}
                placeholder="Kangemi"
                required
              />
            </div>
          </Section>

          {/* Operator */}
          <Section title="Operator">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {operators.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setReportForm({ ...reportForm, operator: op })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    reportForm.operator === op
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-foreground border-border hover:border-primary'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </Section>

          {/* Fare */}
          <Section title="Fare">
            <Input
              id="fare-paid"
              type="number"
              label="Amount Paid (KES)"
              value={reportForm.fare}
              onChange={(e) => setReportForm({ ...reportForm, fare: e.target.value })}
              placeholder="150"
              required
              min="0"
            />
          </Section>

          {/* Optional */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:underline py-2">
              Optional Details
            </summary>
            <div className="space-y-4 mt-4 pt-4 border-t border-border">
              {/* Traffic */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Traffic</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setReportOptional({ ...reportOptional, traffic: level })}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                        reportOptional.traffic === level
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border hover:border-primary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Weather</label>
                <div className="flex gap-2">
                  {['Sunny', 'Rain'].map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setReportOptional({ ...reportOptional, weather: condition })}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                        reportOptional.weather === condition
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border hover:border-primary'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label htmlFor="notes" className="text-xs font-medium text-foreground">Notes</label>
                <textarea
                  id="notes"
                  value={reportOptional.notes}
                  onChange={(e) => setReportOptional({ ...reportOptional, notes: e.target.value })}
                  placeholder="Any additional details..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>
            </div>
          </details>

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={submitting}
            className="w-full"
          >
            {submitting ? 'Submitting' : 'Submit'}
          </Button>
        </form>
      </div>
    );
  }
}
