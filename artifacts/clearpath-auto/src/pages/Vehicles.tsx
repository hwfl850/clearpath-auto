import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, X, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/SkeletonCard";
import { fetchVehicles, vehicleFullName, formatPrice, type Vehicle } from "@/lib/vehiclesApi";

type Category = "All" | "Truck" | "SUV" | "Car";
const CATEGORIES: Category[] = ["All", "Truck", "SUV", "Car"];

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const fullName = vehicleFullName(vehicle);
  const savings = vehicle.msrp && vehicle.our_price ? vehicle.msrp - vehicle.our_price : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-border bg-card overflow-hidden group flex flex-col"
      data-testid={`card-vehicle-${vehicle.slug}`}
    >
      <div className="aspect-[16/10] overflow-hidden relative bg-muted">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={fullName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1">
          {vehicle.category}
        </span>
        {savings && savings > 0 && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1">
            Save {formatPrice(savings)}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          {vehicle.make}
        </p>
        <h3 className="text-lg font-bold leading-tight mb-1">{fullName}</h3>
        {vehicle.tagline && (
          <p className="text-sm text-muted-foreground mb-4 leading-snug line-clamp-2">
            {vehicle.tagline}
          </p>
        )}

        {Object.keys(vehicle.specs ?? {}).length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
            {Object.entries(vehicle.specs)
              .slice(0, 4)
              .map(([k, v]) => (
                <div key={k} className="text-xs">
                  <span className="text-muted-foreground">{k}: </span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border flex items-end justify-between gap-3">
          <div>
            {vehicle.msrp && (
              <p className="text-xs text-muted-foreground line-through">
                MSRP {formatPrice(vehicle.msrp)}
              </p>
            )}
            {vehicle.our_price && (
              <p className="text-xl font-bold text-primary">
                {formatPrice(vehicle.our_price)}
              </p>
            )}
          </div>
          <Link href={`/request?model=${vehicle.slug}`}>
            <Button
              size="sm"
              className="rounded-none font-bold uppercase tracking-wide shrink-0"
              data-testid={`btn-request-${vehicle.slug}`}
            >
              Get Price <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchVehicles().then((data) => {
      if (!cancelled) {
        setVehicles(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return vehicles.filter((v) => {
      const matchCat = activeCategory === "All" || v.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const full = vehicleFullName(v).toLowerCase();
      return (
        full.includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.trim ?? "").toLowerCase().includes(q)
      );
    });
  }, [vehicles, search, activeCategory]);

  const counts: Record<Category, number> = useMemo(() => {
    const c: Record<Category, number> = { All: vehicles.length, Truck: 0, SUV: 0, Car: 0 };
    vehicles.forEach((v) => { c[v.category as Category] = (c[v.category as Category] ?? 0) + 1; });
    return c;
  }, [vehicles]);

  return (
    <>
      <Helmet>
        <title>Browse Vehicles | ClearPath Auto</title>
        <meta
          name="description"
          content="Browse every truck and SUV we source and deliver nationwide — full model names, real pricing, no haggling."
        />
      </Helmet>

      <div className="flex flex-col w-full min-h-screen bg-background">
        {/* Page header with integrated search */}
        <div className="bg-secondary text-secondary-foreground pt-14 pb-10">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Available Vehicles
            </p>
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
              Find Your Vehicle
            </h1>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by make, model, or trim…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-12 bg-background/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                data-testid="input-vehicle-search"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter tabs + count */}
        <div className="border-b border-border bg-muted/40 sticky top-16 z-30">
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-6 overflow-x-auto">
            <div className="flex items-center gap-1 py-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`btn-filter-${cat.toLowerCase()}`}
                  className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                  {!loading && (
                    <span className="ml-1.5 text-xs opacity-60">
                      ({counts[cat] ?? 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!loading && (
              <p className="text-sm text-muted-foreground whitespace-nowrap py-3">
                {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
                {search ? ` matching "${search}"` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Vehicle grid */}
        <div className="container mx-auto px-4 md:px-6 py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-2xl font-bold mb-2">No vehicles found</p>
              <p className="text-muted-foreground mb-6">
                Try a different search term or clear the filter.
              </p>
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {!loading && (
          <div className="bg-secondary text-secondary-foreground py-16 text-center mt-auto">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-3">
                Don't see what you're looking for?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                We can source virtually any new vehicle. Reach out and tell us exactly what you want.
              </p>
              <Link href="/request">
                <Button
                  size="lg"
                  className="rounded-none font-bold uppercase tracking-wide"
                  data-testid="btn-cta-custom-request"
                >
                  Request Any Vehicle
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
