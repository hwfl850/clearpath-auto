import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Shield, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const requestSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  model: z.string().min(1, "Please select a vehicle model"),
  zipCode: z.string().min(5, "ZIP code is required"),
  message: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const MODELS = [
  { id: "jeep-wrangler", name: "Jeep Wrangler" },
  { id: "jeep-gladiator", name: "Jeep Gladiator" },
  { id: "jeep-grand-cherokee", name: "Jeep Grand Cherokee" },
  { id: "ram-1500", name: "Ram 1500" },
  { id: "ford-bronco", name: "Ford Bronco" },
  { id: "ford-f150", name: "Ford F-150" },
  { id: "ford-maverick", name: "Ford Maverick" },
  { id: "lincoln-navigator", name: "Lincoln Navigator" },
  { id: "lincoln-aviator", name: "Lincoln Aviator" },
  { id: "mini-cooper", name: "MINI Cooper" },
  { id: "other", name: "Other / Not Listed" },
];

export default function Request() {
  const [location] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      model: "",
      zipCode: "",
      message: "",
    },
  });

  // Extract model from URL if present (e.g. ?model=jeep-wrangler)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const modelParam = searchParams.get("model");
    if (modelParam && MODELS.some(m => m.id === modelParam)) {
      form.setValue("model", modelParam);
    }
  }, [form]);

  function onSubmit(data: RequestFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4">
        <Card className="max-w-md w-full border-border rounded-none shadow-lg">
          <CardContent className="pt-10 pb-10 px-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">Request Received</h2>
            <p className="text-muted-foreground mb-8">
              Thanks for reaching out. One of our dedicated concierges will review your request and get back to you within 24 hours with next steps and pricing details.
            </p>
            <Button 
              className="w-full rounded-none font-bold uppercase" 
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="bg-secondary text-secondary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">Get Your Price</h1>
          <p className="text-lg text-slate-300 max-w-2xl">Tell us what you're looking for. We'll find it, secure the real price, and handle the rest.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          <div className="lg:col-span-2">
            <Card className="rounded-none border-border shadow-sm">
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" className="rounded-none border-border focus-visible:ring-primary bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" className="rounded-none border-border focus-visible:ring-primary bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" className="rounded-none border-border focus-visible:ring-primary bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(555) 123-4567" className="rounded-none border-border focus-visible:ring-primary bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">Vehicle of Interest</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-none border-border focus:ring-primary bg-muted/50">
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-none">
                                {MODELS.map(model => (
                                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">Delivery ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" className="rounded-none border-border focus-visible:ring-primary bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase font-bold text-xs tracking-wider text-muted-foreground">Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific trim, color, or options you're looking for?" 
                              className="rounded-none border-border focus-visible:ring-primary min-h-[120px] bg-muted/50" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 rounded-none font-bold uppercase tracking-widest text-lg shadow-[4px_4px_0_0_hsl(var(--secondary))] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--secondary))] transition-all"
                      disabled={isSubmitting}
                      data-testid="btn-submit-request"
                    >
                      {isSubmitting ? "Submitting..." : "Get Your Price"}
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By submitting this form, you agree to our privacy policy. We will never sell your data.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="bg-secondary text-secondary-foreground p-8">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4 border-b border-white/20 pb-4">What happens next?</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-white">We search</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Our concierges scan our nationwide network for your exact match.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-white">Real price quoted</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">We present the final, out-the-door price including our transparent flat fee.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-white">Digital sign & delivery</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Sign the paperwork online and schedule your driveway delivery.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="border border-border p-6 flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-bold uppercase tracking-wider text-sm mb-1">No Obligation</h4>
                <p className="text-sm text-muted-foreground">Requesting a price doesn't lock you in. You only pay when you approve the final number and sign the paperwork.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
