'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Upload,
  Info,
  AlertCircle,
  Copy,
  Bus,
  BusFront,
  Motorbike,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import ModeBadge, { TransitMode } from '@/components/ui/ModeBadge';

// ─── Types ─────────────────────────────────────────────────────────────────────
type KenyanTransitMode = 'Bus' | 'Matatu' | 'Motorbike';

interface ContributionForm {
  // Route Info
  transitMode: KenyanTransitMode;
  originStop: string;
  destinationStop: string;
  city: string;
  pickupTime: string;
  dropTime: string;
  // Fare Details
  singleFare: string;
  currency: string;
  // Source
  sourceType: string;
}

const SOURCE_TYPES = [
  { id: 'src-official', value: 'official-website', label: 'Official Agency Website' },
  { id: 'src-app', value: 'official-app', label: 'Official Transit App' },
  { id: 'src-ticket', value: 'ticket-machine', label: 'Ticket Machine / Kiosk' },
  { id: 'src-personal', value: 'personal-travel', label: 'Personal Travel (no documentation)' },
];

const STEPS = ['Route Info', 'Fare & Source', 'Review'];

export default function FareContributionContent() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contributionId] = useState('CONTRIB-' + Math.floor(10000 + Math.random() * 90000));
  const [selectedMode, setSelectedMode] = useState<KenyanTransitMode>('Bus');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ContributionForm>({
    defaultValues: {
      transitMode: 'Bus',
      originStop: '',
      destinationStop: '',
      city: '',
      pickupTime: '',
      dropTime: '',
      singleFare: '',
      currency: 'KSH',
      sourceType: 'official-website',
    },
  });

  const watchedAll = watch();

  const stepFields: (keyof ContributionForm)[][] = [
    ['transitMode', 'originStop', 'destinationStop', 'city', 'pickupTime', 'dropTime'],
    ['singleFare', 'sourceType'],
  ];

  const handleNext = async () => {
    const fields = stepFields[step] || [];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async () => {
    setSubmitting(true);
    // Backend: POST /api/contributions with form data
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Fare data submitted for review!', {
      description: `Contribution ID: ${contributionId}`,
    });
  };

  if (submitted) {
    return <SuccessState contributionId={contributionId} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Contribute Fare Data</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Help the community by adding or updating fare information for a transit route.
        </p>
      </div>

      {/* Step Progress */}
      <div className="bg-card border border-border rounded-xl shadow-card p-4">
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <React.Fragment key={`step-${label}`}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 ${
                    i < step
                      ? 'bg-primary border-primary text-primary-foreground'
                      : i === step
                      ? 'bg-primary/10 border-primary text-primary' :'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    i === step ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-200 ${
                    i < step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-card border border-border rounded-xl shadow-card">
          {/* ── Step 0: Route Info ── */}
          {step === 0 && (
            <div className="p-6 space-y-6 fade-in">
              <SectionHeader
                title="Route Information"
                description="Identify the transit route this fare applies to."
              />

              {/* Transit Mode */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Transit Mode <span className="text-[color:var(--status-outdated)]">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select the type of transit service for this route.
                </p>
                <div className="flex gap-3 flex-wrap">
                  {(['Bus', 'Matatu', 'Motorbike'] as KenyanTransitMode[]).map((mode) => {
                    const icons: Record<KenyanTransitMode, React.ReactNode> = {
                      Bus: <Bus size={16} />,
                      Matatu: <BusFront size={16} />,
                      Motorbike: <Motorbike size={16} />,
                    };
                    return (
                      <button
                        key={`mode-btn-${mode}`}
                        type="button"
                        onClick={() => {
                          setSelectedMode(mode);
                          setValue('transitMode', mode);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                          selectedMode === mode
                            ? 'bg-primary/10 border-primary text-primary' :'bg-muted/40 border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {icons[mode]}
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Origin + Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Origin Stop / Station <span className="text-[color:var(--status-outdated)]">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Starting point of this fare segment.
                  </p>
                  <input
                    {...register('originStop', { required: 'Origin stop is required' })}
                    placeholder="e.g. Howard Terminal"
                    className={`w-full text-sm bg-input border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.originStop ? 'border-[color:var(--status-outdated)]' : 'border-border'
                    }`}
                  />
                  {errors.originStop && (
                    <p className="text-xs text-[color:var(--status-outdated)] mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.originStop.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Destination Stop / Station <span className="text-[color:var(--status-outdated)]">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    End point of this fare segment.
                  </p>
                  <input
                    {...register('destinationStop', { required: 'Destination stop is required' })}
                    placeholder="e.g. Navy Pier"
                    className={`w-full text-sm bg-input border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.destinationStop ? 'border-[color:var(--status-outdated)]' : 'border-border'
                    }`}
                  />
                  {errors.destinationStop && (
                    <p className="text-xs text-[color:var(--status-outdated)] mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.destinationStop.message}
                    </p>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="max-w-sm">
                <label className="block text-sm font-semibold text-foreground mb-1">
                  City / Metro Area <span className="text-[color:var(--status-outdated)]">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  The city or metro area this route operates in.
                </p>
                <input
                  {...register('city', { required: 'City is required' })}
                  placeholder="e.g. Nairobi, Kenya"
                  className={`w-full text-sm bg-input border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                    errors.city ? 'border-[color:var(--status-outdated)]' : 'border-border'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-[color:var(--status-outdated)] mt-1 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Pickup Time + Drop Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Pickup Time <span className="text-[color:var(--status-outdated)]">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Departure time from origin stop.
                  </p>
                  <input
                    {...register('pickupTime', { required: 'Pickup time is required' })}
                    type="time"
                    className={`w-full text-sm bg-input border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.pickupTime ? 'border-[color:var(--status-outdated)]' : 'border-border'
                    }`}
                  />
                  {errors.pickupTime && (
                    <p className="text-xs text-[color:var(--status-outdated)] mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.pickupTime.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Drop Destination Time <span className="text-[color:var(--status-outdated)]">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Estimated arrival time at destination.
                  </p>
                  <input
                    {...register('dropTime', { required: 'Drop time is required' })}
                    type="time"
                    className={`w-full text-sm bg-input border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.dropTime ? 'border-[color:var(--status-outdated)]' : 'border-border'
                    }`}
                  />
                  {errors.dropTime && (
                    <p className="text-xs text-[color:var(--status-outdated)] mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.dropTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Fare & Source ── */}
          {step === 1 && (
            <div className="p-6 space-y-6 fade-in">
              <SectionHeader
                title="Fare & Source"
                description="Enter the single trip fare and where you got this information."
              />

              {/* Single Fare */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Single Trip Fare (KSH) <span className="text-[color:var(--status-outdated)]">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    The standard one-way fare for this route.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">KSH</span>
                    <input
                      {...register('singleFare', {
                        required: 'Single fare is required',
                        pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Enter a valid fare (e.g. 0, 500, 1200)' },
                        min: { value: 0, message: 'Fare must be 0 or more' },
                      })}
                      placeholder="e.g. 50, 500, 1200"
                      className={`w-full pl-10 pr-3 py-2.5 text-sm bg-input border rounded-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                        errors.singleFare ? 'border-[color:var(--status-outdated)]' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.singleFare && (
                    <p className="text-xs text-[color:var(--status-outdated)] mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.singleFare.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Source Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Information Source <span className="text-[color:var(--status-outdated)]">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Where did you get this fare information?
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SOURCE_TYPES.map((st) => (
                    <label
                      key={st.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all ${
                        watch('sourceType') === st.value
                          ? 'bg-primary/10 border-primary text-primary' :'bg-muted/40 border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="radio"
                        value={st.value}
                        {...register('sourceType')}
                        className="sr-only"
                      />
                      {st.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Review ── */}
          {step === 2 && (
            <div className="p-6 space-y-6 fade-in">
              <SectionHeader
                title="Review Your Contribution"
                description="Please review all details before submitting. Your contribution helps the FareTrack community!"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewSection title="Route Info">
                  <ReviewRow label="Mode">
                    <ModeBadge mode={selectedMode} />
                  </ReviewRow>
                  <ReviewRow label="Origin" value={watchedAll.originStop} />
                  <ReviewRow label="Destination" value={watchedAll.destinationStop} />
                  <ReviewRow label="City" value={watchedAll.city} />
                  <ReviewRow label="Pickup Time" value={watchedAll.pickupTime} />
                  <ReviewRow label="Drop Time" value={watchedAll.dropTime} />
                </ReviewSection>
                <ReviewSection title="Fare & Source">
                  <ReviewRow label="Single Fare" value={watchedAll.singleFare ? `KSH ${watchedAll.singleFare}` : '—'} mono />
                  <ReviewRow label="Source Type" value={SOURCE_TYPES.find((s) => s.value === watchedAll.sourceType)?.label || '—'} />
                </ReviewSection>
              </div>

              <div className="flex items-start gap-2 bg-secondary/50 border border-secondary rounded-lg p-3 text-xs text-secondary-foreground">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>
                  By submitting, you confirm this fare information is accurate to the best of your knowledge. FareTrack contributors are credited publicly after verification.
                </span>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft size={15} />
              Back
            </button>
            <span className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </span>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all active:scale-95"
              >
                Continue
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[140px] justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <PlusCircle size={15} />
                    Submit Contribution
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="pb-4 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      {children ? (
        <span>{children}</span>
      ) : (
        <span className={`text-xs font-medium text-foreground text-right ${mono ? 'font-mono' : ''}`}>
          {value || '—'}
        </span>
      )}
    </div>
  );
}

function SuccessState({ contributionId }: { contributionId: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-[color:var(--status-verified-bg)] rounded-full flex items-center justify-center">
        <CheckCircle size={40} className="text-[color:var(--status-verified)]" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Contribution Submitted!</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Your fare data has been submitted for community review. Once verified by 3 contributors, it will appear in Fare Search.
        </p>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-card p-4 flex items-center gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Contribution ID</p>
          <p className="font-mono text-sm font-semibold text-foreground">{contributionId}</p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(contributionId);
            toast.success('Contribution ID copied');
          }}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
        >
          <Copy size={14} />
        </button>
      </div>
      <div className="flex gap-3">
        <a
          href="/"
          className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          Back to Fare Search
        </a>
        <a
          href="/fare-tracker"
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View Fare Tracker
        </a>
      </div>
    </div>
  );
}