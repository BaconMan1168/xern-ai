-- Migration 013: add optional customer_notes field to feedback_files
-- Stores user-supplied context about the customer segment represented by a file,
-- e.g. "Enterprise tier, 2+ years, high ARR". Used by the AI to weight feedback.

alter table public.feedback_files
  add column if not exists customer_notes text;
