'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getLocalReportedFares, LocalReportedFareItem } from '@/lib/local-reported-fares';

interface ReportedFareItem {
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

export default function ReportedFaresPage() {
  const [reportedFares, setReportedFares] = useState<ReportedFareItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const response = await fetch('/api/fare-reports');
        const data = await response.json();
        if (isMounted) {
          const localReports = getLocalReportedFares();
          setReportedFares([...localReports, ...(data.reports ?? [])]);
        }
      } catch (error) {
        console.error('Could not load reported fares', error);
        if (isMounted) {
          setReportedFares(getLocalReportedFares());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReports();
    const intervalId = window.setInterval(loadReports, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleConfirm = (id: string) => {
    setReportedFares((prev) =>
      prev.map((item) => (item.id === id ? { ...item, confirmedBy: item.confirmedBy + 1 } : item))
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Reported Fares</h1>
          <p className="text-sm text-muted-foreground">
            Community-submitted fares with confirmation counts, time context, and traffic/weather notes.
          </p>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading submitted fare reports…</p>}

          {!loading && reportedFares.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
              No fare reports have been submitted yet.
            </div>
          )}

          {reportedFares.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.route}</p>
                  <p className="text-xs text-muted-foreground">{item.operator}</p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {item.confirmedBy} confirmed
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Fare</p>
                  <p className="font-semibold text-foreground">KES {item.fare}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reported</p>
                  <p className="font-semibold text-foreground">{item.reportedAt}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Context</p>
                  <p className="font-semibold text-foreground">{item.context}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Window</p>
                  <p className="font-semibold text-foreground">{item.window}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-2.5 py-1">Weather: {item.weather}</span>
                <span className="rounded-full border border-border px-2.5 py-1">Fuel: {item.fuel}</span>
              </div>

              <button
                onClick={() => handleConfirm(item.id)}
                className="mt-4 inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Confirm this fare
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
