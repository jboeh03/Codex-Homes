"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  budgetBands,
  budgetLabels,
  projectTypeLabels,
  projectTypes,
  timelineLabels,
  timelines,
} from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3 | 4;

interface FormState {
  projectType?: (typeof projectTypes)[number];
  rooms: string[];
  scopeNotes: string;
  timeline?: (typeof timelines)[number];
  budget?: (typeof budgetBands)[number];
  name: string;
  email: string;
  phone: string;
  zip: string;
  address: string;
}

const initial: FormState = {
  rooms: [],
  scopeNotes: "",
  name: "",
  email: "",
  phone: "",
  zip: "",
  address: "",
};

const stepLabels = ["Project", "Scope", "Timeline", "Budget", "Contact"];

export function LeadForm({ source = "estimate-page" }: { source?: string }) {
  const [step, setStep] = useState<Step>(0);
  const [data, setData] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(4, (s + 1) as Step));
  const back = () => setStep((s) => Math.max(0, (s - 1) as Step));

  const canAdvance = () => {
    switch (step) {
      case 0:
        return !!data.projectType;
      case 1:
        return true; // scope notes optional
      case 2:
        return !!data.timeline;
      case 3:
        return !!data.budget;
      case 4:
        return (
          data.name.length > 1 &&
          /^.+@.+\..+$/.test(data.email) &&
          data.phone.length > 6 &&
          /^\d{5}$/.test(data.zip)
        );
      default:
        return false;
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-[--color-border] bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[--color-primary]" />
        <h3 className="mt-4 font-display text-2xl">You&apos;re on the schedule.</h3>
        <p className="mt-3 text-[--color-brand-darkgray]">
          We&apos;ll reach out within one business hour to confirm a time. If you&apos;d
          rather text us right now, just reply to the confirmation message.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[--color-border] bg-white p-6 shadow-sm sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                i <= step
                  ? "bg-[--color-primary] text-white"
                  : "bg-[--color-muted] text-[--color-brand-darkgray]"
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs sm:inline",
                i === step ? "text-[--color-foreground]" : "text-[--color-brand-darkgray]"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Steps */}
      {step === 0 && (
        <Step title="What kind of project?" subtitle="Pick the closest match — we'll refine in conversation.">
          <div className="grid gap-3 sm:grid-cols-2">
            {projectTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setData({ ...data, projectType: t })}
                className={cn(
                  "rounded-md border p-4 text-left text-sm font-medium transition-colors",
                  data.projectType === t
                    ? "border-[--color-primary] bg-[--color-secondary] text-[--color-primary]"
                    : "border-[--color-border] bg-white hover:bg-[--color-muted]"
                )}
              >
                {projectTypeLabels[t]}
              </button>
            ))}
          </div>
        </Step>
      )}

      {step === 1 && (
        <Step title="Tell us a little more." subtitle="Optional. Even a sentence helps us come prepared.">
          <Textarea
            placeholder="e.g. We want to open the wall between the kitchen and the family room, replace the cabinets, and put in a big island."
            value={data.scopeNotes}
            onChange={(e) => setData({ ...data, scopeNotes: e.target.value })}
          />
        </Step>
      )}

      {step === 2 && (
        <Step title="When would you like to start?">
          <div className="grid gap-3 sm:grid-cols-2">
            {timelines.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setData({ ...data, timeline: t })}
                className={cn(
                  "rounded-md border p-4 text-left text-sm font-medium",
                  data.timeline === t
                    ? "border-[--color-primary] bg-[--color-secondary] text-[--color-primary]"
                    : "border-[--color-border] bg-white hover:bg-[--color-muted]"
                )}
              >
                {timelineLabels[t]}
              </button>
            ))}
          </div>
        </Step>
      )}

      {step === 3 && (
        <Step
          title="Rough budget?"
          subtitle="Be honest — a range we both agree on makes the rest easy."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {budgetBands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setData({ ...data, budget: b })}
                className={cn(
                  "rounded-md border p-4 text-left text-sm font-medium",
                  data.budget === b
                    ? "border-[--color-primary] bg-[--color-secondary] text-[--color-primary]"
                    : "border-[--color-border] bg-white hover:bg-[--color-muted]"
                )}
              >
                {budgetLabels[b]}
              </button>
            ))}
          </div>
        </Step>
      )}

      {step === 4 && (
        <Step title="Where should we send the details?">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Name
              <Input
                className="mt-1"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Email
              <Input
                type="email"
                className="mt-1"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Phone
              <Input
                type="tel"
                className="mt-1"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Zip
              <Input
                inputMode="numeric"
                maxLength={5}
                className="mt-1"
                value={data.zip}
                onChange={(e) =>
                  setData({ ...data, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })
                }
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Address (optional)
              <Input
                className="mt-1"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </Step>
      )}

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0 || submitting}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={next} disabled={!canAdvance()}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={!canAdvance() || submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Send my project
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl tracking-tight text-[--color-brand-black]">
        {title}
      </h3>
      {subtitle && <p className="mt-2 text-sm text-[--color-brand-darkgray]">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
