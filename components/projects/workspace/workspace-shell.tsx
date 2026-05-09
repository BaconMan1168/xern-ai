"use client";

import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Star, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalyzeButton } from "./analyze-button";
import { InputsSection } from "./inputs-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PlanLimitTooltip } from "@/components/billing/plan-limit-tooltip";
import type { LimitResult } from "@/lib/billing/limits";
import type { FeedbackFile } from "@/lib/types/database";

interface WorkspaceShellProps {
  projectId: string;
  hasInputs: boolean;
  isStale: boolean;
  hasResults: boolean;
  insightsCount: number;
  proposalsCount: number;
  canAddFileResult: LimitResult;
  canRerun: LimitResult;
  files: FeedbackFile[];
  lastAnalyzedAt: string | null;
  themesContent: React.ReactNode;
  proposalsContent: React.ReactNode;
}

// Stages driven by elapsed time (ms thresholds)
const STAGES = [
  { after: 0,     label: "Reading feedback…" },
  { after: 12000, label: "Synthesizing themes…" },
  { after: 28000, label: "Generating proposals…" },
  { after: 50000, label: "Almost done, hang tight…" },
] as const;

function getStageLabel(elapsed: number): string {
  const stage = [...STAGES].reverse().find((s) => elapsed >= s.after) ?? STAGES[0];
  return stage.label;
}

function useAnalysisStage(active: boolean) {
  // Label is updated only inside timer callbacks — never synchronously in the effect body.
  const [label, setLabel] = useState<string>(STAGES[0].label);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    // Defer the reset so it runs in a timer callback, not synchronously in the effect body.
    const resetId = setTimeout(() => setLabel(STAGES[0].label), 0);
    const id = setInterval(() => {
      setLabel(getStageLabel(performance.now() - start));
    }, 1000);
    return () => {
      clearTimeout(resetId);
      clearInterval(id);
    };
  }, [active]);

  return label;
}

function AnalysisProgress({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          className="h-full rounded-full bg-[var(--color-accent-primary)]"
          initial={{ width: "4%" }}
          animate={{ width: "92%" }}
          transition={{ duration: 55, ease: "easeInOut" }}
        />
      </div>

      {/* Status label */}
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent-primary)]" />
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] text-[var(--color-text-secondary)]"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Skeleton cards */}
      <div className="flex flex-col gap-2.5 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] p-5"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-4 flex-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-2)]" />
              <div className="h-4 w-20 rounded-[var(--radius-pill)] bg-[var(--color-surface-2)]" />
            </div>
            <div className="h-3 w-4/5 rounded-[var(--radius-sm)] bg-[var(--color-surface-1)]" />
            <div className="mt-1.5 h-3 w-3/5 rounded-[var(--radius-sm)] bg-[var(--color-surface-1)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceShell({
  projectId,
  hasInputs,
  isStale,
  hasResults,
  insightsCount,
  proposalsCount,
  canAddFileResult,
  canRerun,
  files,
  lastAnalyzedAt,
  themesContent,
  proposalsContent,
}: WorkspaceShellProps) {
  const router = useRouter();
  // isPendingRefresh stays true for the entire RSC re-fetch after analysis, going
  // false only once React has the new payload ready to paint — no gap, no flash.
  const [isPendingRefresh, startRefreshTransition] = useTransition();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // showSkeleton covers both phases:
  //   isAnalyzing      — API call in flight (before router.refresh)
  //   isPendingRefresh — RSC re-fetch in flight (after router.refresh)
  const showSkeleton = isAnalyzing || isPendingRefresh;
  const stageLabel = useAnalysisStage(isAnalyzing);

  // Passed to AnalyzeButton so it can trigger the refresh without owning the router.
  const handleRefresh = useCallback(() => {
    setIsAnalyzing(false);
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  // Optimistic file count — updated immediately when InputsSection deletes a file.
  // Syncs back to server truth when files prop updates after router.refresh().
  const [localFileCount, setLocalFileCount] = useState(files.length);
  useEffect(() => {
    setLocalFileCount(files.length);
  }, [files.length]);

  // Optimistic stale state — updated immediately when InputsSection reports that
  // all post-analysis files have been deleted. Syncs back to server truth on refresh.
  const [localIsStale, setLocalIsStale] = useState(isStale);
  useEffect(() => {
    setLocalIsStale(isStale);
  }, [isStale]);
  const handleNewFilesChange = useCallback((hasNewFiles: boolean) => {
    if (!hasNewFiles) setLocalIsStale(false);
  }, []);

  // Max files = server count + remaining slots. After an optimistic delete the
  // localFileCount drops below maxFiles immediately, re-enabling the button.
  const maxFiles = files.length + (canAddFileResult.remaining ?? 0);
  const effectiveCanAdd = localFileCount < maxFiles;

  const addInputsButton = effectiveCanAdd ? (
    <Link
      href={`/projects/${projectId}/add`}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
    >
      <Plus size={13} />
      Add inputs
    </Link>
  ) : (
    <PlanLimitTooltip
      allowed={false}
      reason={canAddFileResult.reason}
      title="Upload limit reached"
    >
      <button className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-text-secondary)]">
        <Plus size={13} />
        Add inputs
      </button>
    </PlanLimitTooltip>
  );

  return (
    <>
      {/* Action buttons row */}
      <div className="mb-7 flex items-center justify-end gap-2">
        {addInputsButton}
        <div className="relative">
          <AnalyzeButton
            projectId={projectId}
            hasInputs={hasInputs}
            isStale={isStale}
            hasResults={hasResults}
            canRerun={canRerun}
            onAnalyzingChange={setIsAnalyzing}
            onRefresh={handleRefresh}
          />
          {hasInputs && !isAnalyzing && (
            <span className="absolute right-0 top-full mt-1 whitespace-nowrap text-[11px] text-[var(--color-text-tertiary)]">
              Analysis may take 30–60 s
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border-subtle)]" />

      {/* Inputs section — always static */}
      <div className="py-7">
        <ScrollReveal delay={0}>
          <InputsSection
            files={files}
            projectId={projectId}
            lastAnalyzedAt={lastAnalyzedAt}
            canAddFile={canAddFileResult}
            onFileCountChange={setLocalFileCount}
            onNewFilesChange={handleNewFilesChange}
          />
        </ScrollReveal>
      </div>

      <div className="h-px bg-[var(--color-border-subtle)]" />

      {/* Themes section */}
      <div className="py-7">
        <div className="mb-4 flex items-center gap-2">
          <Search
            size={15}
            strokeWidth={1.8}
            className={
              hasResults
                ? "text-[var(--color-text-secondary)]"
                : "text-[var(--color-text-tertiary)]"
            }
          />
          <span
            className={`text-[14px] font-semibold ${
              hasResults
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-tertiary)]"
            }`}
          >
            Themes
          </span>
          {hasResults ? (
            <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
              {insightsCount} found
            </span>
          ) : (
            <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--color-text-tertiary)]">
              Unlocks after Analyze
            </span>
          )}
        </div>

        {localIsStale && !showSkeleton && (
          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(40_40%_28%)] bg-[hsl(40_40%_12%)] px-4 py-2.5">
            <Info size={13} strokeWidth={1.8} className="shrink-0 text-[hsl(40_70%_55%)]" />
            <p className="text-[12px] text-[hsl(40_70%_65%)]">
              New inputs were added after the last analysis. Re-analyze to include them.
            </p>
          </div>
        )}
        {showSkeleton ? <AnalysisProgress label={stageLabel} /> : themesContent}
      </div>

      <div className="h-px bg-[var(--color-border-subtle)]" />

      {/* Proposals section */}
      <div className="py-7">
        <div className="mb-4 flex items-center gap-2">
          <Star
            size={15}
            strokeWidth={1.8}
            className={
              hasResults
                ? "text-[var(--color-text-secondary)]"
                : "text-[var(--color-text-tertiary)]"
            }
          />
          <span
            className={`text-[14px] font-semibold ${
              hasResults
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-tertiary)]"
            }`}
          >
            Proposals
          </span>
          {hasResults ? (
            <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
              {proposalsCount} generated
            </span>
          ) : (
            <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--color-text-tertiary)]">
              Unlocks after Analyze
            </span>
          )}
        </div>

        {localIsStale && !showSkeleton && (
          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(40_40%_28%)] bg-[hsl(40_40%_12%)] px-4 py-2.5">
            <Info size={13} strokeWidth={1.8} className="shrink-0 text-[hsl(40_70%_55%)]" />
            <p className="text-[12px] text-[hsl(40_70%_65%)]">
              These proposals are based on a previous analysis. Re-analyze to reflect new inputs.
            </p>
          </div>
        )}
        {showSkeleton ? null : proposalsContent}
      </div>
    </>
  );
}
