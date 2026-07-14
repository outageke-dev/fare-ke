'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, BusFront, Info, ShieldCheck } from 'lucide-react';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';

const supportedModes: TransitMode[] = ['Bus', 'Matatu', 'Motorbike'];

export default function FareTrackerContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Fare tracker
        </p>
        <h1 className="text-3xl font-semibold text-foreground">No tracked routes yet</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          We removed the false sample routes and alerts. The tracker will fill up once real fare
          submissions are verified.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-secondary p-2 text-secondary-foreground">
              <BusFront size={18} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Supported modes</h2>
              <p className="text-sm text-muted-foreground">
                Track only the modes we keep in the app: bus, matatu, and motorbike.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {supportedModes.map((item) => (
              <ModeBadge key={item} mode={item} />
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">Nothing to display yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once a fare is submitted and verified, it can appear here as a real tracked route
              instead of a sample.
            </p>
          </div>
        </section>

        <aside className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-secondary p-2 text-secondary-foreground">
              <ShieldCheck size={18} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Tracker rule</h2>
              <p className="text-sm text-muted-foreground">
                Only real fares that have been contributed and checked should appear here.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Next action
            </p>
            <p className="mt-2 text-sm text-foreground">
              Add a fare first, then come back here once the data is verified.
            </p>
            <Link
              href="/fare-contribution"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Bell size={16} />
              Contribute fare data
            </Link>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary/40 p-4 text-sm text-secondary-foreground">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              There are no fake charts or route tables left in this view, just a clean empty
              state.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Search fares
            <ArrowRight size={14} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
