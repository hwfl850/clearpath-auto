import { motion } from "framer-motion";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, FileText, Truck, Search, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How It Works | ClearPath Auto</title>
        <meta
          name="description"
          content="Three steps to your new vehicle — no dealership, no haggling. We source, price, and deliver nationwide."
        />
      </Helmet>

      <div className="flex flex-col w-full min-h-screen bg-background">
        <div className="bg-secondary text-secondary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">How It Works</h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              The dealership model is broken. We fixed it. Here's how we get your new vehicle to your driveway with zero stress.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-20 max-w-4xl">
          <div className="space-y-24">

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
                  Fill out our simple request form. Be as specific as you want — trim level, color, packages, even preferred delivery date. We'll assign a dedicated concierge to your search immediately.
                </p>
              </div>
            </motion.div>

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
                  We Source &amp; Price It
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Our concierge searches our preferred dealer network — a nationwide group of dealers with which we have buying relationships. We negotiate the real number on your behalf, not the sticker price you see online.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  You receive a single, transparent out-the-door quote: vehicle price, our flat service fee, destination charge, and applicable taxes and fees — all spelled out. No surprises. You only say yes or no.
                </p>
              </div>
            </motion.div>

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
                  Sign Digitally
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Once you approve the price, you sign the paperwork digitally. We handle all the paperwork coordination with the dealer. No trip to the finance office. No sitting in a waiting room.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Need financing? We work with top-tier lenders and can present competitive rates alongside the vehicle quote — or you can bring your own from your bank or credit union.
                </p>
              </div>
            </motion.div>

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
                  It Arrives at Your Door
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We coordinate transport with vetted enclosed or open carrier partners. Your vehicle arrives at your home, office, or wherever you specify — anywhere in the contiguous United States.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Have a trade-in? We'll pick it up at the same time your new vehicle is delivered. One trip, no hassle.
                </p>
              </div>
            </motion.div>

          </div>

          <div className="mt-20 border-t border-border pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: CheckCircle2, title: "No Obligation Quote", text: "You only commit when you love the number. Walk away at any point, no fee." },
                { icon: CheckCircle2, title: "Transparent Flat Fee", text: "One line item. You'll see it in the quote alongside the vehicle price." },
                { icon: CheckCircle2, title: "Nationwide Delivery", text: "All 48 contiguous states. Hawaii and Alaska by special arrangement." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <item.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wide mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/request">
                <Button
                  size="lg"
                  className="rounded-none font-bold uppercase tracking-wider h-14 px-10"
                  data-testid="btn-start-request"
                >
                  Start Your Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
