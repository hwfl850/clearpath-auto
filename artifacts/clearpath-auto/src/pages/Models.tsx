import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import jeepWrangler from "@assets/vehicles/jeep-wrangler.jpg";
import jeepGladiator from "@assets/vehicles/jeep-gladiator.jpg";
import jeepGrandCherokee from "@assets/vehicles/jeep-grand-cherokee.jpg";
import ram1500 from "@assets/vehicles/ram-1500.jpg";
import fordBronco from "@assets/vehicles/ford-bronco.jpg";
import fordF150 from "@assets/vehicles/ford-f150.jpg";
import fordMaverick from "@assets/vehicles/ford-maverick.jpg";
import miniCooper from "@assets/vehicles/mini-cooper.jpg";
import lincolnNavigator from "@assets/vehicles/lincoln-navigator.jpg";
import lincolnAviator from "@assets/vehicles/lincoln-aviator.jpg";

const FEATURED = [
  { slug: "jeep-wrangler", name: "2025 Jeep Wrangler Rubicon", img: jeepWrangler, category: "SUV" },
  { slug: "ford-bronco", name: "2025 Ford Bronco Badlands", img: fordBronco, category: "SUV" },
  { slug: "ram-1500", name: "2025 Ram 1500 TRX", img: ram1500, category: "Truck" },
  { slug: "ford-f150", name: "2025 Ford F-150 Raptor", img: fordF150, category: "Truck" },
  { slug: "jeep-gladiator", name: "2025 Jeep Gladiator Mojave", img: jeepGladiator, category: "Truck" },
  { slug: "jeep-grand-cherokee", name: "2025 Jeep Grand Cherokee Summit Reserve", img: jeepGrandCherokee, category: "SUV" },
  { slug: "ford-maverick", name: "2025 Ford Maverick Lariat", img: fordMaverick, category: "Truck" },
  { slug: "lincoln-navigator", name: "2025 Lincoln Navigator Black Label", img: lincolnNavigator, category: "SUV" },
  { slug: "lincoln-aviator", name: "2025 Lincoln Aviator Grand Touring", img: lincolnAviator, category: "SUV" },
  { slug: "mini-cooper", name: "2025 MINI Cooper S Hardtop 4-Door", img: miniCooper, category: "Car" },
];

export default function Models() {
  return (
    <>
      <Helmet>
        <title>Featured Models | ClearPath Auto</title>
        <meta
          name="description"
          content="Browse the trucks and SUVs ClearPath Auto sources and delivers nationwide — Jeep, Ram, Ford, Lincoln, and MINI."
        />
      </Helmet>

      <div className="flex flex-col w-full min-h-screen bg-background">
        <div className="bg-secondary text-secondary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Featured Models</h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
              Our Phase 1 lineup — the highest-demand trucks and SUVs we source and deliver anywhere in the country.
            </p>
            <Link href="/vehicles" data-testid="btn-browse-all">
              <Button className="rounded-none font-bold uppercase tracking-wide">
                Browse All Vehicles with Search <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED.map((vehicle) => (
              <div
                key={vehicle.slug}
                className="border border-border overflow-hidden group flex flex-col"
                data-testid={`card-model-${vehicle.slug}`}
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                  <img
                    src={vehicle.img}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                    {vehicle.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base mb-4 flex-1">{vehicle.name}</h3>
                  <Link href={`/request?model=${vehicle.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-none font-bold uppercase tracking-wide"
                      data-testid={`btn-request-${vehicle.slug}`}
                    >
                      Request Price
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
