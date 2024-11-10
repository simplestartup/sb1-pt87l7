"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    features: [
      "Track up to 50 movies/shows",
      "Basic analytics",
      "Watch history",
      "Watchlist management",
      "Mobile app access",
    ],
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    description: "For serious movie & TV enthusiasts",
    price: "$9.99",
    interval: "month",
    priceId: "price_pro_monthly",
    features: [
      "Unlimited tracking",
      "Advanced analytics",
      "Priority support",
      "Custom lists",
      "Early access features",
      "No advertisements",
      "Offline access",
      "Export data",
    ],
    buttonText: "Upgrade to Pro",
    disabled: false,
    popular: true,
  },
  {
    name: "Team",
    description: "Share with friends and family",
    price: "$19.99",
    interval: "month",
    priceId: "price_pro_yearly",
    features: [
      "Everything in Pro",
      "Up to 5 users",
      "Team watchlists",
      "Shared collections",
      "Watch party features",
      "Team analytics",
      "Admin controls",
    ],
    buttonText: "Contact Sales",
    disabled: false,
  },
];

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string) => {
    try {
      setLoading(priceId);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // For demo purposes, show a success message instead of actual Stripe integration
      toast.success("This is a demo - Stripe integration coming soon!");
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("This is a demo version. Stripe integration coming soon!");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            "relative flex flex-col",
            plan.popular && "border-primary shadow-lg"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              Most Popular
            </div>
          )}

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{plan.name}</span>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.interval && (
                  <span className="text-sm text-muted-foreground mb-1">
                    /{plan.interval}
                  </span>
                )}
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </CardHeader>

          <CardContent className="flex-1">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              className={cn(
                "w-full",
                plan.popular ? 
                  "bg-primary hover:bg-primary/90" : 
                  "bg-secondary hover:bg-secondary/90"
              )}
              disabled={plan.disabled || !!loading}
              onClick={() => plan.priceId && handleUpgrade(plan.priceId)}
            >
              {loading === plan.priceId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : plan.popular ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {plan.buttonText}
                </>
              ) : plan.disabled ? (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  {plan.buttonText}
                </>
              ) : (
                plan.buttonText
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}