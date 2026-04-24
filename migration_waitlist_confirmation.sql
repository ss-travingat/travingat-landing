-- Migration: Add email confirmation columns to waitlist table
-- Run this once in the Neon SQL console

ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS confirmed           BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS confirmation_token  TEXT         UNIQUE,
  ADD COLUMN IF NOT EXISTS confirmed_at        TIMESTAMPTZ;
