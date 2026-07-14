'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Info, MapPin, PlusCircle, Search } from 'lucide-react';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';

const supportedModes: TransitMode[] = ['Bus', 'Matatu', 'Motorbike'];

export default function FareSearchContent() {
  const [mode, setMode] = useState<TransitMode>('Matatu');
  const [query, setQuery] = useState('');
  const [lastSearch, setLastSearch] = useState<{ query: string; mode: TransitMode } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLastSearch({
      query: query.trim() || 'this route',
      mode,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Fare search
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Find real fare data</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Sample routes and fake fares have been removed. Search only the modes we actually
          support: bus, matatu, and motorbike.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="fare-search">
                Search route, stage, town, or corridor
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="fare-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="e.g. Nairobi CBD to Githurai"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Mode</p>
              <div className="flex flex-wrap gap-2">
                {supportedModes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      mode === item
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    <ModeBadge mode={item} />
                  </button>
                ))}
              </div>
            </div>
          </form>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-secondary p-2 text-secondary-foreground">
              <Info size={18} />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">What changed</h2>
              <p className="text-sm text-muted-foreground">
                We removed the false sample routes and kept only the transport types you asked
                for.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Supported modes
            </p>
            <div className="flex flex-wrap gap-2">
              {supportedModes.map((item) => (
                <ModeBadge key={item} mode={item} />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        {lastSearch ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <MapPin size={12} />
                {lastSearch.query}
              </span>
              <ModeBadge mode={lastSearch.mode} />
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
              <p className="text-sm font-medium text-foreground">No verified fare data yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We are not showing sample routes. Once real contributions are added for this
                area, results will appear here.
              </p>
              <Link
                href="/fare-contribution"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <PlusCircle size={16} />
                Contribute fare data
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">No search yet</h2>
            <p className="text-sm text-muted-foreground">
              Type a route or stage above to check whether verified fare data exists. If it
              doesn&apos;t, the contribution form is the fastest way to add it.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
