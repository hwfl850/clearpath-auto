import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname, basename } from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
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

async function createTable() {
  console.log("Creating vehicles table…");
  const sql = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        text NOT NULL UNIQUE,
      make        text NOT NULL,
      model       text NOT NULL,
      year        integer NOT NULL,
      trim        text,
      category    text NOT NULL CHECK (category IN ('Truck','SUV','Car')),
      tagline     text,
      description text,
      image_url   text,
      gallery_urls text[] NOT NULL DEFAULT '{}',
      specs       jsonb NOT NULL DEFAULT '{}',
      monthly_searches integer NOT NULL DEFAULT 0,
      available   boolean NOT NULL DEFAULT true,
      sort_order  integer NOT NULL DEFAULT 0
    );
  `;

  const { error } = await supabase.rpc("exec_sql", { query: sql }).single();
  if (error) {
    console.warn("exec_sql RPC not available, trying pg direct…", error.message);
    return false;
  }
  console.log("Table created.");
  return true;
}

async function createTableViaPg() {
  console.log("Creating vehicles table via management API…");
  const projectRef = supabaseUrl!.match(/https:\/\/([^.]+)\./)?.[1];
  if (!projectRef) {
    throw new Error("Could not parse project ref from VITE_SUPABASE_URL");
  }

  const sql = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        text NOT NULL UNIQUE,
      make        text NOT NULL,
      model       text NOT NULL,
      year        integer NOT NULL,
      trim        text,
      category    text NOT NULL CHECK (category IN ('Truck','SUV','Car')),
      tagline     text,
      description text,
      image_url   text,
      gallery_urls text[] NOT NULL DEFAULT '{}',
      specs       jsonb NOT NULL DEFAULT '{}',
      monthly_searches integer NOT NULL DEFAULT 0,
      available   boolean NOT NULL DEFAULT true,
      sort_order  integer NOT NULL DEFAULT 0
    );
  `;

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Management API failed: ${res.status} ${body}`);
  }
  console.log("Table created via management API.");
}

async function ensureBucket() {
  console.log(`Ensuring storage bucket "${BUCKET}" exists…`);
  const { data: existing } = await supabase.storage.getBucket(BUCKET);
  if (existing) {
    console.log("Bucket already exists.");
    return;
  }
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (error) throw new Error(`Failed to create bucket: ${error.message}`);
  console.log("Bucket created.");
}

async function uploadPhotos(): Promise<Record<string, string>> {
  const urlMap: Record<string, string> = {};
  const files = readdirSync(VEHICLES_DIR).filter(
    (f) => extname(f).toLowerCase() === ".jpg" || extname(f).toLowerCase() === ".jpeg" || extname(f).toLowerCase() === ".png" || extname(f).toLowerCase() === ".webp"
  );

  console.log(`Uploading ${files.length} photos…`);

  for (const file of files) {
    const filePath = join(VEHICLES_DIR, file);
    const fileData = readFileSync(filePath);
    const slug = basename(file, extname(file));

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(file, fileData, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error(`  ✗ ${file}: ${error.message}`);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    urlMap[slug] = publicUrl;
    console.log(`  ✓ ${file} → ${publicUrl}`);
  }

  return urlMap;
}

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
    specs: {
      Engine: "3.6L Pentastar V6",
      Drivetrain: "4×4 Rock-Trac",
      "Towing Capacity": "3,500 lbs",
      "Ground Clearance": "10.8 in",
    },
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
    specs: {
      Engine: "3.6L Pentastar V6",
      Payload: "1,700 lbs",
      "Towing Capacity": "7,650 lbs",
      Bed: "5 ft",
    },
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
    specs: {
      Engine: "3.6L V6 / 4xe PHEV",
      Seating: "5 or 7",
      Drivetrain: "Quadra-Drive II",
      "EV Range (4xe)": "25 mi",
    },
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
    specs: {
      Engine: "6.2L Supercharged HEMI V8",
      Horsepower: "702 hp",
      Torque: "650 lb-ft",
      "0–60 mph": "4.5 sec",
    },
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
    specs: {
      Engine: "2.7L EcoBoost V6",
      Drivetrain: "4×4 Advanced",
      "Ground Clearance": "11.6 in",
      Doors: "2 or 4",
    },
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
    specs: {
      Engine: "3.5L High Output EcoBoost V6",
      Horsepower: "450 hp",
      Drivetrain: "4×4 Terrain Management",
      Payload: "1,400 lbs",
    },
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
    specs: {
      Engine: "2.5L Hybrid / 2.0L EcoBoost",
      MPG: "Up to 42 city (hybrid)",
      Payload: "1,500 lbs",
      Towing: "4,000 lbs",
    },
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
    specs: {
      Engine: "3.5L Twin-Turbo V6",
      Horsepower: "440 hp",
      Seating: "7–8",
      Cargo: "103.3 cu ft (behind 1st row)",
    },
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
    specs: {
      Powertrain: "3.0L TT V6 + Electric Motor",
      Horsepower: "494 hp",
      "EV Range": "21 mi",
      Seating: "6",
    },
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
    specs: {
      Engine: "2.0L TwinPower Turbo",
      Horsepower: "189 hp",
      "0–60 mph": "6.3 sec",
      MPG: "28 city / 36 hwy",
    },
    monthly_searches: 22200,
    available: true,
    sort_order: 10,
  },
];

async function seedVehicles(urlMap: Record<string, string>) {
  console.log("Seeding vehicles…");

  const rows = VEHICLES.map((v) => ({
    ...v,
    image_url: urlMap[v.slug] ?? null,
    gallery_urls: urlMap[v.slug] ? [urlMap[v.slug]] : [],
  }));

  const { error } = await supabase
    .from("vehicles")
    .upsert(rows, { onConflict: "slug" });

  if (error) throw new Error(`Failed to seed vehicles: ${error.message}`);
  console.log(`Seeded ${rows.length} vehicles.`);
}

async function main() {
  console.log("=== ClearPath Auto — Supabase seed ===\n");

  await ensureBucket();

  const urlMap = await uploadPhotos();

  await seedVehicles(urlMap);

  console.log("\nDone!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
