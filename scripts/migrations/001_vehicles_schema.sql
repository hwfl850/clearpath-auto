-- ClearPath Auto: vehicles table schema (no price columns)
-- Run this in the Supabase SQL editor to create or verify the table.
-- The seed script (seed-vehicles.ts) handles data insertion.

CREATE TABLE IF NOT EXISTS vehicles (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text    NOT NULL UNIQUE,
  make             text    NOT NULL,
  model            text    NOT NULL,
  year             integer NOT NULL,
  trim             text,
  category         text    NOT NULL CHECK (category IN ('Truck', 'SUV', 'Car')),
  tagline          text,
  description      text,
  image_url        text,
  gallery_urls     text[]  NOT NULL DEFAULT '{}',
  specs            jsonb   NOT NULL DEFAULT '{}',
  monthly_searches integer NOT NULL DEFAULT 0,
  available        boolean NOT NULL DEFAULT true,
  sort_order       integer NOT NULL DEFAULT 0
);

-- Drop price columns if they exist from a previous schema version
ALTER TABLE vehicles DROP COLUMN IF EXISTS msrp;
ALTER TABLE vehicles DROP COLUMN IF EXISTS our_price;

-- Verify: no price columns should be present after migration
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'vehicles'
-- AND column_name IN ('msrp', 'our_price');
-- Expected: 0 rows
