import { motion } from "framer-motion";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Check, Shield, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import jeepWrangler from "@assets/vehicles/jeep-wrangler.jpg";
import fordBronco from "@assets/vehicles/ford-bronco.jpg";
import ram1500 from "@assets/vehicles/ram-1500.jpg";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>ClearPath Auto | Real Price. No Haggling. Nationwide Delivery.</title>
        <meta
          name="description"
          content="Skip the dealership. We source your truck or SUV from our preferred dealer network and deliver it anywhere in the country — at a real, transparent price."
        />
      </Helmet>

      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center pt-20 pb-32 overflow-hidden bg-secondary">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={jeepWrangler}
              alt="Hero Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-[1.1] mb-6">
                  Real price.<br />
                  No haggling.<br />
                  <span className="text-primary">Delivered to your door.</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed"
              >
                Skip the dealership entirely. We buy on your behalf from our preferred dealer network and bring the vehicle to you. Transparent flat fee. No surprises.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/vehicles" data-testid="btn-hero-vehicles">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 rounded-none font-bold tracking-wide uppercase text-base"
                  >
                    Browse Vehicles
                  </Button>
                </Link>
                <Link href="/how-it-works" data-testid="btn-hero-how">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 rounded-none font-bold tracking-wide uppercase text-base border-white text-white hover:bg-white hover:text-secondary"
                  >
                    How it Works
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats/Trust Bar */}
        <section className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-primary-foreground/20">
              <div>
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm font-medium uppercase tracking-wider opacity-90">Independent</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">50</div>
                <div className="text-sm font-medium uppercase tracking-wider opacity-90">States Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">0</div>
                <div className="text-sm font-medium uppercase tracking-wider opacity-90">Dealership Visits</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">$0</div>
                <div className="text-sm font-medium uppercase tracking-wider opacity-90">Hidden Fees</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                  Featured Vehicles
                </h2>
                <p className="text-muted-foreground max-w-2xl text-lg">
                  The Jeep Wrangler alone gets 74,000 searches a month. We make it easy to get yours without the hassle.
                </p>
              </div>
              <Link
                href="/vehicles"
                className="hidden md:flex items-center font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                data-testid="link-view-all"
              >
                View All <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { name: "2025 Jeep Wrangler Rubicon", img: jeepWrangler, desc: "The icon that never compromises.", slug: "jeep-wrangler" },
                { name: "2025 Ford Bronco Badlands", img: fordBronco, desc: "Built wild for the modern trail.", slug: "ford-bronco" },
                { name: "2025 Ram 1500 TRX", img: ram1500, desc: "702 hp. America's super truck.", slug: "ram-1500" },
              ].map((model, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="rounded-none border-border overflow-hidden group cursor-pointer h-full flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={model.img}
                        alt={model.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold tracking-tight mb-2">{model.name}</h3>
                      <p className="text-muted-foreground flex-1 mb-6">{model.desc}</p>
                      <Link href={`/request?model=${model.slug}`}>
                        <Button className="w-full rounded-none font-bold uppercase tracking-wider" variant="outline">
                          Request Price
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 md:hidden text-center">
              <Link href="/vehicles">
                <Button className="rounded-none font-bold uppercase w-full">View All Vehicles</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="py-24 bg-secondary text-white relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">How It Works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Three simple steps to your new vehicle. No negotiations. No stress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-primary flex items-center justify-center rounded-full mb-6 border-4 border-secondary shadow-[0_0_0_2px_hsl(var(--primary))] text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Pick Your Model</h3>
                <p className="text-slate-400">Tell us exactly what you want. Trim, color, options. We handle the rest.</p>
              </div>
              <div className="text-center relative">
                <div className="hidden md:block absolute top-10 -left-1/2 w-full h-[2px] bg-primary/30 -z-10" />
                <div className="w-20 h-20 mx-auto bg-primary flex items-center justify-center rounded-full mb-6 border-4 border-secondary shadow-[0_0_0_2px_hsl(var(--primary))] text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Get Real Price</h3>
                <p className="text-slate-400">We find it in our nationwide network and give you the final, out-the-door price.</p>
              </div>
              <div className="text-center relative">
                <div className="hidden md:block absolute top-10 -left-1/2 w-full h-[2px] bg-primary/30 -z-10" />
                <div className="w-20 h-20 mx-auto bg-primary flex items-center justify-center rounded-full mb-6 border-4 border-secondary shadow-[0_0_0_2px_hsl(var(--primary))] text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4">It Arrives</h3>
                <p className="text-slate-400">Sign the paperwork digitally, and we'll deliver it straight to your driveway.</p>
              </div>
            </div>

            <div className="text-center mt-16">
              <Link href="/how-it-works">
                <Button size="lg" className="rounded-none font-bold uppercase tracking-wider bg-white text-secondary hover:bg-slate-200">
                  Read the details
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">Why ClearPath?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We believe buying a car shouldn't feel like a battle. We act as your agent, leveraging our network to get exactly what you want without the typical dealership games.
                </p>
                <ul className="space-y-6">
                  {[
                    { icon: Shield, title: "Transparent flat fee", text: "You pay exactly what we quote. No surprise doc fees, prep fees, or forced add-ons." },
                    { icon: MapPin, title: "Nationwide access", text: "We aren't limited to local inventory. We source from preferred dealers across the country." },
                    { icon: Clock, title: "Save your weekend", text: "The average dealership visit takes 4 hours. ClearPath takes about 15 minutes of your time." },
                  ].map((benefit, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-background flex items-center justify-center shadow-sm text-primary">
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-wide mb-1">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 -z-10" />
                <img src={fordBronco} alt="Ford Bronco Delivery" className="w-full aspect-square object-cover border-4 border-background" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">Common Questions</h2>
            </div>
            <div className="space-y-6">
              {[
                { q: "Are you a dealership?", a: "No. We are an independent buying service. We work for you, not the dealer." },
                { q: "How do you make money?", a: "We charge a transparent flat fee that is included in the final price we quote you. No hidden margins." },
                { q: "Do you take trade-ins?", a: "Yes, we can arrange for your trade-in to be picked up at the same time your new vehicle is delivered." },
                { q: "Can I finance through you?", a: "We work with top-tier lenders to secure competitive financing, or you can bring your own financing from your bank or credit union." },
              ].map((faq, i) => (
                <div key={i} className="border border-border p-6 hover:border-primary/50 transition-colors">
                  <h3 className="font-bold text-lg mb-2 flex items-start gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground pl-9">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">Ready to skip the dealership?</h2>
            <p className="text-xl opacity-90 mb-10">Select your model and get a real price today. Delivered anywhere in the country.</p>
            <Link href="/request">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-none font-bold uppercase tracking-widest text-lg border-white text-primary hover:bg-white hover:text-primary bg-white"
              >
                Start Your Request
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
