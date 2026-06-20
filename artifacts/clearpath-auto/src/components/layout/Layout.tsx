import { Link } from "wouter";
import { Map, Truck, User, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight uppercase">ClearPath Auto</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-vehicles">
              Browse Vehicles
            </Link>
            <Link href="/models" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-models">
              Featured Models
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-how-it-works">
              How it Works
            </Link>
            <Link href="/request" data-testid="link-request-header">
              <Button size="sm" className="font-semibold rounded-none tracking-wide uppercase px-6">
                Request Price
              </Button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="btn-mobile-menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-6 flex flex-col gap-4">
            <Link href="/vehicles" className="font-medium hover:text-primary transition-colors py-1" onClick={() => setMobileOpen(false)} data-testid="link-mobile-vehicles">
              Browse Vehicles
            </Link>
            <Link href="/models" className="font-medium hover:text-primary transition-colors py-1" onClick={() => setMobileOpen(false)} data-testid="link-mobile-models">
              Featured Models
            </Link>
            <Link href="/how-it-works" className="font-medium hover:text-primary transition-colors py-1" onClick={() => setMobileOpen(false)} data-testid="link-mobile-how">
              How it Works
            </Link>
            <Link href="/request" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-none font-semibold uppercase tracking-wide" data-testid="btn-mobile-request">
                Request Price
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-secondary text-secondary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl tracking-tight uppercase">ClearPath Auto</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Real price. No haggling. Delivered to your door. The true independent buying service for people who hate negotiating at the dealership.
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 text-sm text-primary">Links</h4>
              <ul className="space-y-3">
                <li><Link href="/vehicles" className="text-muted-foreground hover:text-white transition-colors text-sm">Browse Vehicles</Link></li>
                <li><Link href="/models" className="text-muted-foreground hover:text-white transition-colors text-sm">Featured Models</Link></li>
                <li><Link href="/how-it-works" className="text-muted-foreground hover:text-white transition-colors text-sm">How it Works</Link></li>
                <li><Link href="/request" className="text-muted-foreground hover:text-white transition-colors text-sm">Request a Price</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider mb-4 text-sm text-primary">Stay Connected</h4>
              <p className="text-sm text-muted-foreground mb-4">Get updates on new models and delivery areas.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-background/10 border border-border/20 rounded-none px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ClearPath Auto. All rights reserved. Not affiliated with any dealer.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Map className="h-3 w-3" /> Nationwide Delivery</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> Independent</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
