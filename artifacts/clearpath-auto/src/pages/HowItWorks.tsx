import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle2, FileText, Truck, Search, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">How It Works</h1>
          <p className="text-xl text-slate-300 max-w-2xl">The dealership model is broken. We fixed it. Here's how we get your new vehicle to your driveway with zero stress.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20 max-w-4xl">
        <div className="space-y-24">
          
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-16 h-16 bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground text-2xl font-bold rounded-none shadow-[4px_4px_0_0_hsl(var(--secondary))]">
              1
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                <Search className="h-8 w-8 text-primary" />
                Tell Us What You Want
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                You know what you want. A Jeep Wrangler Rubicon in Sarge Green, or a Ford Bronco Badlands with the Sasquatch package. You shouldn't have to settle for whatever happens to be on the local lot.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fill out our simple request form. Be as specific as you want. We'll assign a dedicated concierge to your search.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-16 h-16 bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground text-2xl font-bold rounded-none shadow-[4px_4px_0_0_hsl(var(--secondary))]">
              2
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                <PhoneCall className="h-8 w-8 text-primary" />
                We Source & Price It
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We tap into our nationwide network of preferred dealers. Because we buy in volume, we skip the retail games and get straight to the real price.
              </p>
              <div className="bg-muted p-6 border-l-4 border-primary my-6">
                <h4 className="font-bold uppercase tracking-wider text-sm mb-2">The ClearPath Guarantee</h4>
                <p className="text-muted-foreground">The price we present is out-the-door. It includes the vehicle, our flat fee, and delivery. No surprise document fees or mandatory paint protection packages.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-16 h-16 bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground text-2xl font-bold rounded-none shadow-[4px_4px_0_0_hsl(var(--secondary))]">
              3
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Digital Paperwork
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Once you approve the price, we handle the financing and paperwork digitally. No sitting in a finance manager's office for hours while they try to sell you extended warranties. Review and sign from your couch.
              </p>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-16 h-16 bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground text-2xl font-bold rounded-none shadow-[4px_4px_0_0_hsl(var(--secondary))]">
              4
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                <Truck className="h-8 w-8 text-primary" />
                Delivered to Your Door
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Your vehicle is loaded onto a transport truck and brought directly to your home or office, anywhere in the country. It arrives clean, detailed, and ready for the road.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Fully insured transport
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Tracking updates provided
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Trade-in pickup available
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
        
        <div className="mt-24 pt-12 border-t border-border text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">Ready to get started?</h2>
          <Link href="/request">
            <Button size="lg" className="h-16 px-12 rounded-none font-bold uppercase tracking-widest text-lg shadow-[4px_4px_0_0_hsl(var(--secondary))] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--secondary))] transition-all">
              Request Your Price
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
