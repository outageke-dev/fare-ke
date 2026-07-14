'use client';

import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import FareDisplay from '@/components/ui/FareDisplay';
import ListItem from '@/components/ui/ListItem';
import { toast } from 'sonner';

interface FareRouteDetailProps {
  from: string;
  to: string;
}

// Mock data - will be replaced with real database queries
const mockRouteData = {
  currentFare: 150,
  confidence: 'High' as const,
  reportCount: 24,
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
  operators: ['Super Metro', 'Metrotrans', 'Forward Travelers', 'City Shuttle', 'KBS', '2NK'],
  trend: [
    { day: 'Mon', fare: 145 },
    { day: 'Tue', fare: 148 },
    { day: 'Wed', fare: 150 },
    { day: 'Thu', fare: 152 },
    { day: 'Fri', fare: 155 },
    { day: 'Sat', fare: 150 },
    { day: 'Sun', fare: 148 },
  ],
};

export default function FareRouteDetail({ from, to }: FareRouteDetailProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    operator: '',
    fare: '',
    traffic: '',
    weather: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportForm.operator || !reportForm.fare) {
      toast.error('Please fill required fields');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);

    toast.success('Thank you. Your report helps commuters across Kenya.');
    setReportForm({ operator: '', fare: '', traffic: '', weather: '', notes: '' });
    setShowReportForm(false);
  };

  if (showReportForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-8 px-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setShowReportForm(false)}
          >
            ← Back
          </Button>
          <div className="mt-4">
            <h1>Report Fare</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {from} → {to}
            </p>
          </div>
        </div>

        <form onSubmit={handleReportSubmit} className="space-y-6">
          <Section title="Operator">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mockRouteData.operators.map((op) => (
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

          <Section title="Fare">
            <input
              type="number"
              value={reportForm.fare}
              onChange={(e) => setReportForm({ ...reportForm, fare: e.target.value })}
              placeholder="KES amount"
              required
              min="0"
              className="input-field w-full"
            />
          </Section>

          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:underline py-2">
              Optional Details
            </summary>
            <div className="space-y-4 mt-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-xs font-medium">Traffic</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setReportForm({ ...reportForm, traffic: level })}
                      className={`px-3 py-1.5 rounded text-xs font-medium border ${
                        reportForm.traffic === level
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Weather</label>
                <div className="flex gap-2">
                  {['Sunny', 'Rain'].map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setReportForm({ ...reportForm, weather: condition })}
                      className={`px-3 py-1.5 rounded text-xs font-medium border ${
                        reportForm.weather === condition
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium block mb-2">Notes</label>
                <textarea
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                  placeholder="Any additional details..."
                  className="input-field w-full resize-none"
                  rows={3}
                />
              </div>
            </div>
          </details>

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

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-6">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="flex items-center gap-2">
          {from} <ArrowRight size={32} className="text-muted-foreground" /> {to}
        </h1>
        <p className="text-muted-foreground">Real-time matatu fare estimates</p>
      </header>

      {/* Current Fare */}
      <div className="space-y-6 py-4 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase mb-3">
            Estimated Current Fare
          </p>
          <FareDisplay amount={mockRouteData.currentFare} size="lg" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <Badge variant={mockRouteData.confidence === 'High' ? 'success' : 'neutral'}>
              {mockRouteData.confidence}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users size={12} />
              Reports
            </p>
            <p className="text-sm font-semibold">{mockRouteData.reportCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              Updated
            </p>
            <p className="text-sm font-semibold">{mockRouteData.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Fare Range */}
      <div className="grid grid-cols-3 gap-3 py-4 border-b border-border">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Lowest Today</p>
          <FareDisplay amount={mockRouteData.lowestToday} size="sm" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Average</p>
          <FareDisplay amount={mockRouteData.averageFare} size="sm" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Highest Today</p>
          <FareDisplay amount={mockRouteData.highestToday} size="sm" />
        </div>
      </div>

      {/* 7-Day Trend */}
      <Section title="7-Day Trend" subtitle="Fare changes over the week">
        <div className="flex items-end justify-between gap-1 h-24 bg-secondary p-4 rounded-lg">
          {mockRouteData.trend.map((point) => {
            const maxFare = Math.max(...mockRouteData.trend.map((p) => p.fare));
            const minFare = Math.min(...mockRouteData.trend.map((p) => p.fare));
            const range = maxFare - minFare;
            const height = ((point.fare - minFare) / range) * 100;

            return (
              <div key={point.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${Math.max(height, 10)}%` }}
                />
                <p className="text-xs text-muted-foreground">{point.day}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Recent Reports */}
      <Section title="Recent Reports" subtitle="Latest submissions from commuters">
        <div className="space-y-2">
          {mockRouteData.reports.map((report) => (
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
        onClick={() => setShowReportForm(true)}
        className="w-full"
      >
        Report Fare
      </Button>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `Matatu Fares: ${from} to ${to}`,
            description: `Real-time matatu fare estimates from ${from} to ${to}`,
            areaServed: 'Kenya',
            priceRange: `KES ${mockRouteData.lowestToday}-KES ${mockRouteData.highestToday}`,
          }),
        }}
      />
    </div>
  );
}
