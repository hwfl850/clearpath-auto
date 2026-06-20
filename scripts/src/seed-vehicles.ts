/**
 * ClearPath Auto — Supabase seed script
 *
 * Run: pnpm --filter @workspace/scripts run seed-vehicles
 * Requires: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * What it does (all steps are idempotent):
 *  1. Verify the vehicles table schema — ensures no msrp/our_price columns exist
 *  2. Ensure the "vehicles" Storage bucket exists (creates it if not)
 *  3. Upload all 10 photos from artifacts/clearpath-auto/public/vehicles/
 *  4. Upsert all 10 vehicle rows (keyed on slug) with hosted Storage URLs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌  Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const BUCKET = "vehicles";
const VEHICLES_DIR = join(
  new URL(".", import.meta.url).pathname,
  "../../artifacts/clearpath-auto/public/vehicles"
);

// ─── Step 1: Schema verification ─────────────────────────────────────────────

async function verifySchema() {
  console.log("Step 1 — Verifying vehicles table schema…");

  // Attempt to select price columns. If they exist the query returns data;
  // if they don't, PostgREST returns an error referencing the column.
  const priceColumns = ["msrp", "our_price"];
  for (const col of priceColumns) {
    const { error } = await supabase
      .from("vehicles")
      .select(col)
      .limit(1);

    if (!error) {
      // Column exists — abort so a human can drop it via the migration SQL
      console.error(
        `❌  Column "${col}" exists on the vehicles table. ` +
          `Run scripts/migrations/001_vehicles_schema.sql in the Supabase SQL editor to drop it.`
      );
      process.exit(1);
    }

    // Error means the column doesn't exist — exactly what we want
    if (error.message.includes(col) || error.code === "42703" || error.message.includes("column")) {
      console.log(`  ✓  "${col}" column absent — schema is clean`);
    } else {
      // Unexpected error (e.g. table doesn't exist yet)
      console.warn(`  ⚠  Unexpected error checking "${col}": ${error.message}`);
    }
  }
}

// ─── Step 2: Storage bucket ───────────────────────────────────────────────────

async function ensureBucket() {
  console.log("\nStep 2 — Ensuring Storage bucket exists…");
  const { data: existing } = await supabase.storage.getBucket(BUCKET);
  if (existing) {
    console.log(`  ✓  Bucket "${BUCKET}" already exists`);
    return;
  }
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (error) throw new Error(`Failed to create bucket: ${error.message}`);
  console.log(`  ✓  Bucket "${BUCKET}" created`);
}

// ─── Step 3: Photo upload ────────────────────────────────────────────────────

async function uploadPhotos(): Promise<Record<string, string>> {
  const urlMap: Record<string, string> = {};

  const files = readdirSync(VEHICLES_DIR).filter((f) => {
    const ext = extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  console.log(`\nStep 3 — Uploading ${files.length} photos…`);

  for (const file of files) {
    const slug = file.replace(/\.[^.]+$/, ""); // filename without extension
    const fileData = readFileSync(join(VEHICLES_DIR, file));

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(file, fileData, { contentType: "image/jpeg", upsert: true });

    if (error) {
      console.error(`  ✗  ${file}: ${error.message}`);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    urlMap[slug] = publicUrl;
    console.log(`  ✓  ${file} → ${publicUrl}`);
  }

  return urlMap;
}

// ─── Step 4: Vehicle rows ─────────────────────────────────────────────────────

const VEHICLES = [
  {
    slug: "jeep-wrangler",
    make: "Jeep",
    model: "Wrangler",
    year: 2025,
    trim: "Rubicon",
    category: "SUV",
    tagline: "The icon that never compromises",
    description:
      "The Jeep Wrangler Rubicon is the definitive off-road SUV — Trail-Rated, capable, and instantly recognizable. We source it below sticker and deliver it anywhere in the country.",
    specs: { Engine: "3.6L Pentastar V6", Drivetrain: "4×4 Rock-Trac", "Towing Capacity": "3,500 lbs", "Ground Clearance": "10.8 in" },
    monthly_searches: 74000,
    available: true,
    sort_order: 1,
  },
  {
    slug: "jeep-gladiator",
    make: "Jeep",
    model: "Gladiator",
    year: 2025,
    trim: "Mojave",
    category: "Truck",
    tagline: "The only truck that's Trail-Rated",
    description:
      "Part Wrangler, all truck. The Jeep Gladiator Mojave pairs legendary Jeep DNA with a real cargo bed — and we'll put it in your driveway for less than the sticker.",
    specs: { Engine: "3.6L Pentastar V6", Payload: "1,700 lbs", "Towing Capacity": "7,650 lbs", Bed: "5 ft" },
    monthly_searches: 40500,
    available: true,
    sort_order: 2,
  },
  {
    slug: "jeep-grand-cherokee",
    make: "Jeep",
    model: "Grand Cherokee",
    year: 2025,
    trim: "Summit Reserve",
    category: "SUV",
    tagline: "Premium meets unstoppable",
    description:
      "The Grand Cherokee Summit Reserve is Jeep's most refined SUV yet — available as a plug-in hybrid and packed with luxury features that cost far less when you go through ClearPath.",
    specs: { Engine: "3.6L V6 / 4xe PHEV", Seating: "5 or 7", Drivetrain: "Quadra-Drive II", "EV Range (4xe)": "25 mi" },
    monthly_searches: 40500,
    available: true,
    sort_order: 3,
  },
  {
    slug: "ram-1500",
    make: "Ram",
    model: "1500",
    year: 2025,
    trim: "TRX",
    category: "Truck",
    tagline: "The most powerful production truck on earth",
    description:
      "702 horsepower. 0–60 in 4.5 seconds. The Ram 1500 TRX is the desert-dominating super truck that redefines what a pickup can do. We source it at real pricing and deliver nationwide.",
    specs: { Engine: "6.2L Supercharged HEMI V8", Horsepower: "702 hp", Torque: "650 lb-ft", "0–60 mph": "4.5 sec" },
    monthly_searches: 40500,
    available: true,
    sort_order: 4,
  },
  {
    slug: "ford-bronco",
    make: "Ford",
    model: "Bronco",
    year: 2025,
    trim: "Badlands",
    category: "SUV",
    tagline: "Built wild. Delivered to your door.",
    description:
      "The Ford Bronco Badlands was born to go anywhere — removable doors and top, Sasquatch-package ready, and available in 2- or 4-door. We put it in your driveway at a price the dealer can't advertise.",
    specs: { Engine: "2.7L EcoBoost V6", Drivetrain: "4×4 Advanced", "Ground Clearance": "11.6 in", Doors: "2 or 4" },
    monthly_searches: 60500,
    available: true,
    sort_order: 5,
  },
  {
    slug: "ford-f150",
    make: "Ford",
    model: "F-150",
    year: 2025,
    trim: "Raptor",
    category: "Truck",
    tagline: "America's best-selling truck, at our price",
    description:
      "The Ford F-150 Raptor is the high-performance off-road truck that's dominated the segment for years. Fox Racing shocks, 450 hp, and a presence that commands every road.",
    specs: { Engine: "3.5L High Output EcoBoost V6", Horsepower: "450 hp", Drivetrain: "4×4 Terrain Management", Payload: "1,400 lbs" },
    monthly_searches: 33100,
    available: true,
    sort_order: 6,
  },
  {
    slug: "ford-maverick",
    make: "Ford",
    model: "Maverick",
    year: 2025,
    trim: "Lariat",
    category: "Truck",
    tagline: "The compact truck that punches way above",
    description:
      "The Ford Maverick Lariat is the smart-sized, fuel-efficient pickup that's earned a cult following. Standard hybrid on base, remarkable value at every trim — and we deliver it anywhere.",
    specs: { Engine: "2.5L Hybrid / 2.0L EcoBoost", MPG: "Up to 42 city (hybrid)", Payload: "1,500 lbs", Towing: "4,000 lbs" },
    monthly_searches: 33100,
    available: true,
    sort_order: 7,
  },
  {
    slug: "lincoln-navigator",
    make: "Lincoln",
    model: "Navigator",
    year: 2025,
    trim: "Black Label",
    category: "SUV",
    tagline: "Full-size luxury at its absolute pinnacle",
    description:
      "The Lincoln Navigator Black Label is the definitive American luxury SUV — three rows, massaging seats, panoramic roof, and enough presence to own any entrance. Nationwide delivery, real pricing.",
    specs: { Engine: "3.5L Twin-Turbo V6", Horsepower: "440 hp", Seating: "7–8", Cargo: "103.3 cu ft (behind 1st row)" },
    monthly_searches: 18100,
    available: true,
    sort_order: 8,
  },
  {
    slug: "lincoln-aviator",
    make: "Lincoln",
    model: "Aviator",
    year: 2025,
    trim: "Grand Touring",
    category: "SUV",
    tagline: "Midsize luxury with a turbocharged heart",
    description:
      "The Lincoln Aviator Grand Touring delivers plug-in hybrid efficiency wrapped in a genuinely beautiful three-row SUV. Available below sticker via ClearPath with delivery anywhere in the US.",
    specs: { Powertrain: "3.0L TT V6 + Electric Motor", Horsepower: "494 hp", "EV Range": "21 mi", Seating: "6" },
    monthly_searches: 12100,
    available: true,
    sort_order: 9,
  },
  {
    slug: "mini-cooper",
    make: "MINI",
    model: "Cooper",
    year: 2025,
    trim: "S Hardtop 4-Door",
    category: "Car",
    tagline: "Go-kart soul, grown-up practicality",
    description:
      "The MINI Cooper S 4-Door is the perfectly sized car that refuses to be ordinary. 189 hp, razor-sharp handling, and a character that's impossible to ignore — delivered to your door below MSRP.",
    specs: { Engine: "2.0L TwinPower Turbo", Horsepower: "189 hp", "0–60 mph": "6.3 sec", MPG: "28 city / 36 hwy" },
    monthly_searches: 22200,
    available: true,
    sort_order: 10,
  },
];

async function seedVehicles(urlMap: Record<string, string>) {
  console.log(`\nStep 4 — Upserting ${VEHICLES.length} vehicle rows…`);

  const rows = VEHICLES.map((v) => ({
    ...v,
    image_url:
      urlMap[v.slug] ??
      `https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/${v.slug}.jpg`,
    gallery_urls: [
      urlMap[v.slug] ??
        `https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/${v.slug}.jpg`,
    ],
  }));

  const { error } = await supabase
    .from("vehicles")
    .upsert(rows, { onConflict: "slug" });

  if (error) throw new Error(`Failed to seed vehicles: ${error.message}`);
  console.log(`  ✓  ${rows.length} rows upserted`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== ClearPath Auto — Supabase seed ===\n");

  await verifySchema();
  await ensureBucket();
  const urlMap = await uploadPhotos();
  await seedVehicles(urlMap);

  console.log("\n✅  Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
