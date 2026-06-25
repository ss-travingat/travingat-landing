-- Migration: Add token expiry column to waitlist table
-- Run this once in the Neon SQL console

ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;
