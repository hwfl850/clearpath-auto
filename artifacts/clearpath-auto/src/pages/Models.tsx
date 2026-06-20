import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

const MODELS = [
  { id: "jeep-wrangler", brand: "Jeep", name: "Wrangler", img: jeepWrangler, type: "SUV" },
  { id: "ford-bronco", brand: "Ford", name: "Bronco", img: fordBronco, type: "SUV" },
  { id: "ram-1500", brand: "Ram", name: "1500", img: ram1500, type: "Truck" },
  { id: "ford-f150", brand: "Ford", name: "F-150", img: fordF150, type: "Truck" },
  { id: "jeep-gladiator", brand: "Jeep", name: "Gladiator", img: jeepGladiator, type: "Truck" },
  { id: "jeep-grand-cherokee", brand: "Jeep", name: "Grand Cherokee", img: jeepGrandCherokee, type: "SUV" },
  { id: "ford-maverick", brand: "Ford", name: "Maverick", img: fordMaverick, type: "Truck" },
  { id: "lincoln-navigator", brand: "Lincoln", name: "Navigator", img: lincolnNavigator, type: "SUV" },
  { id: "lincoln-aviator", brand: "Lincoln", name: "Aviator", img: lincolnAviator, type: "SUV" },
  { id: "mini-cooper", brand: "MINI", name: "Cooper", img: miniCooper, type: "Car" },
];

export default function Models() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Browse Models</h1>
          <p className="text-xl text-slate-300 max-w-2xl">Find your next vehicle. We'll source it, negotiate the real price, and deliver it to your door.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-border pb-6">
          <div className="text-muted-foreground font-medium">
            Showing {MODELS.length} vehicles
          </div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-4 w-4" /> Filter by Type
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {MODELS.map((model) => (
            <motion.div key={model.id} variants={item}>
              <Card className="rounded-none border-border overflow-hidden group h-full flex flex-col hover:border-primary/50 transition-colors">
                <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                  <img 
                    src={model.img} 
                    alt={`${model.brand} ${model.name}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {model.brand}
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">{model.type}</div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight mb-6">{model.name}</h3>
                  </div>
                  <Link href={`/request?model=${model.id}`} data-testid={`btn-request-${model.id}`}>
                    <Button className="w-full rounded-none font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                      Request Price <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <section className="py-20 bg-muted/30 border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Don't see what you're looking for?</h2>
          <p className="text-muted-foreground mb-8">We can source almost any new vehicle from our nationwide network. Just let us know what you want.</p>
          <Link href="/request">
            <Button size="lg" className="rounded-none font-bold uppercase tracking-wider">
              Custom Request
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
