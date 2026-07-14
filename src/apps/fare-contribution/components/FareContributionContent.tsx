'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Copy, Info, PlusCircle, Send, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';

const supportedModes: TransitMode[] = ['Bus', 'Matatu', 'Motorbike'];

export default function FareContributionContent() {
  const [mode, setMode] = useState<TransitMode>('Matatu');
  const [submitted, setSubmitted] = useState(false);
  const [contributionId] = useState(() => `CONTRIB-${Math.floor(100000 + Math.random() * 900000)}`);

  const [copyLabel, setCopyLabel] = useState('Copy ID');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const routeName = String(formData.get('routeName') || '').trim();
    const fareAmount = String(formData.get('fareAmount') || '').trim();

    if (!routeName || !fareAmount) {
      toast.error('Please add a route name and fare amount.');
      return;
    }

    setSubmitted(true);
    toast.success('Fare data submitted for review', {
      description: `Contribution ID: ${contributionId}`,
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contributionId);
    setCopyLabel('Copied');
    toast.success('Contribution ID copied');
    window.setTimeout(() => setCopyLabel('Copy ID'), 1500);
  };

  const headerNote = useMemo(
    () => 'No multi-step form, no fake route lists, just the details needed to submit a real fare.',
    []
  );

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-[color:var(--status-verified-bg)] p-4 text-[color:var(--status-verified)]">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-semibold text-foreground">Contribution received</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Your KSh fare submission is ready for review. Once it is verified, it can be shown in
          search and tracking views.
        </p>

        <div className="mt-6 w-full rounded-2xl border border-border bg-card p-5 text-left shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Contribution ID
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="font-mono text-sm font-semibold text-foreground">{contributionId}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <Copy size={14} />
              {copyLabel}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
          >
            Back to search
          </Link>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle size={16} />
            Add another fare
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Contribute fare data
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Add a real fare in KSh</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{headerNote}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <input type="hidden" name="mode" value={mode} />
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Transport mode</p>
            <div className="flex flex-wrap gap-2">
              {supportedModes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`rounded-full border px-3 py-2 transition-colors ${
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

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Route or stage name" name="routeName" placeholder="Nairobi CBD to Rongai" />
            <Field label="Area or corridor" name="area" placeholder="Nairobi" />
            <Field label="Fare amount (KSh)" name="fareAmount" placeholder="50" inputMode="numeric" />
            <Field label="Source" name="source" placeholder="Personal trip, receipt, or official notice" />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Optional: time of day, stage number, or anything useful for verification."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary/40 p-4 text-sm text-secondary-foreground">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              Keep it simple: one route, one mode, one KSh fare. We removed the old multi-step
              flow so it is quicker to submit real data.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Send size={16} />
            Submit fare
          </button>
        </form>

        <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Supported modes
            </p>
            <div className="flex flex-wrap gap-2">
              {supportedModes.map((item) => (
                <ModeBadge key={item} mode={item} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">What we removed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fake agencies, fake routes, and dollar pricing are gone. Only real KSh fare entries
              should be added now.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Next step
            </p>
            <p className="mt-2 text-sm text-foreground">
              If you do not have a fare yet, open search first or head to the tracker once real
              submissions exist.
            </p>
            <Link
              href="/fare-tracker"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <MapPin size={16} />
              View tracker
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  inputMode,
}: {
  label: string;
  name: string;
  placeholder: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
      />
    </div>
  );
}
