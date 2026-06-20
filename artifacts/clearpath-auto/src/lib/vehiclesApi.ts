import { supabase } from "./supabase";

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  category: "Truck" | "SUV" | "Car";
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  gallery_urls: string[];
  specs: Record<string, string>;
  monthly_searches: number;
  available: boolean;
  sort_order: number;
}

export function vehicleFullName(v: Vehicle): string {
  return `${v.year} ${v.make} ${v.model}${v.trim ? " " + v.trim : ""}`;
}

const FALLBACK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    slug: "jeep-wrangler",
    make: "Jeep",
    model: "Wrangler",
    year: 2025,
    trim: "Rubicon",
    category: "SUV",
    tagline: "The icon that never compromises",
    description:
      "The Jeep Wrangler Rubicon is the definitive off-road SUV — Trail-Rated, capable, and instantly recognizable. We source it below sticker and deliver it anywhere in the country.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/jeep-wrangler.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/jeep-wrangler.jpg"],
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
    id: "2",
    slug: "jeep-gladiator",
    make: "Jeep",
    model: "Gladiator",
    year: 2025,
    trim: "Mojave",
    category: "Truck",
    tagline: "The only truck that's Trail-Rated",
    description:
      "Part Wrangler, all truck. The Jeep Gladiator Mojave pairs legendary Jeep DNA with a real cargo bed — and we'll put it in your driveway for less than the sticker.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/jeep-gladiator.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/jeep-gladiator.jpg"],
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
    id: "3",
    slug: "jeep-grand-cherokee",
    make: "Jeep",
    model: "Grand Cherokee",
    year: 2025,
    trim: "Summit Reserve",
    category: "SUV",
    tagline: "Premium meets unstoppable",
    description:
      "The Grand Cherokee Summit Reserve is Jeep's most refined SUV yet — available as a plug-in hybrid and packed with luxury features that cost far less when you go through ClearPath.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/jeep-grand-cherokee.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/jeep-grand-cherokee.jpg"],
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
    id: "4",
    slug: "ram-1500",
    make: "Ram",
    model: "1500",
    year: 2025,
    trim: "TRX",
    category: "Truck",
    tagline: "The most powerful production truck on earth",
    description:
      "702 horsepower. 0–60 in 4.5 seconds. The Ram 1500 TRX is the desert-dominating super truck that redefines what a pickup can do. We source it at real pricing and deliver nationwide.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ram-1500.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ram-1500.jpg"],
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
    id: "5",
    slug: "ford-bronco",
    make: "Ford",
    model: "Bronco",
    year: 2025,
    trim: "Badlands",
    category: "SUV",
    tagline: "Built wild. Delivered to your door.",
    description:
      "The Ford Bronco Badlands was born to go anywhere — removable doors and top, Sasquatch-package ready, and available in 2- or 4-door. We put it in your driveway at a price the dealer can't advertise.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ford-bronco.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ford-bronco.jpg"],
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
    id: "6",
    slug: "ford-f150",
    make: "Ford",
    model: "F-150",
    year: 2025,
    trim: "Raptor",
    category: "Truck",
    tagline: "America's best-selling truck, at our price",
    description:
      "The Ford F-150 Raptor is the high-performance off-road truck that's dominated the segment for years. Fox Racing shocks, 450 hp, and a presence that commands every road.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ford-f150.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ford-f150.jpg"],
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
    id: "7",
    slug: "ford-maverick",
    make: "Ford",
    model: "Maverick",
    year: 2025,
    trim: "Lariat",
    category: "Truck",
    tagline: "The compact truck that punches way above",
    description:
      "The Ford Maverick Lariat is the smart-sized, fuel-efficient pickup that's earned a cult following. Standard hybrid on base, remarkable value at every trim — and we deliver it anywhere.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ford-maverick.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/ford-maverick.jpg"],
    specs: {
      Engine: "2.5L Hybrid / 2.0L EcoBoost",
      MPG: "Up to 42 city (hybrid)",
      Payload: "1,500 lbs",
      "Towing": "4,000 lbs",
    },
    monthly_searches: 33100,
    available: true,
    sort_order: 7,
  },
  {
    id: "8",
    slug: "lincoln-navigator",
    make: "Lincoln",
    model: "Navigator",
    year: 2025,
    trim: "Black Label",
    category: "SUV",
    tagline: "Full-size luxury at its absolute pinnacle",
    description:
      "The Lincoln Navigator Black Label is the definitive American luxury SUV — three rows, massaging seats, panoramic roof, and enough presence to own any entrance. Nationwide delivery, real pricing.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/lincoln-navigator.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/lincoln-navigator.jpg"],
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
    id: "9",
    slug: "lincoln-aviator",
    make: "Lincoln",
    model: "Aviator",
    year: 2025,
    trim: "Grand Touring",
    category: "SUV",
    tagline: "Midsize luxury with a turbocharged heart",
    description:
      "The Lincoln Aviator Grand Touring delivers plug-in hybrid efficiency wrapped in a genuinely beautiful three-row SUV. Available below sticker via ClearPath with delivery anywhere in the US.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/lincoln-aviator.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/lincoln-aviator.jpg"],
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
    id: "10",
    slug: "mini-cooper",
    make: "MINI",
    model: "Cooper",
    year: 2025,
    trim: "S Hardtop 4-Door",
    category: "Car",
    tagline: "Go-kart soul, grown-up practicality",
    description:
      "The MINI Cooper S 4-Door is the perfectly sized car that refuses to be ordinary. 189 hp, razor-sharp handling, and a character that's impossible to ignore — delivered to your door below MSRP.",
    image_url: "https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/mini-cooper.jpg",
    gallery_urls: ["https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/mini-cooper.jpg"],
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

const CACHE_KEY = "clearpath_vehicles_v1";
const CACHE_TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  data: Vehicle[];
  timestamp: number;
}

function readCache(): Vehicle[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: Vehicle[]): void {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function clearVehicleCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const cached = readCache();
  if (cached) return cached;

  if (!supabase) {
    return FALLBACK_VEHICLES;
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("available", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return FALLBACK_VEHICLES;
  }

  writeCache(data as Vehicle[]);
  return data as Vehicle[];
}

export async function fetchVehicleBySlug(
  slug: string
): Promise<Vehicle | null> {
  const all = await fetchVehicles();
  return all.find((v) => v.slug === slug) ?? null;
}
