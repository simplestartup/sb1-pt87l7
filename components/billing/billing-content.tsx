"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Pro",
    description: "Perfect for movie enthusiasts",
    price: "$9.99",
    interval: "month",
    priceId: "price_pro_monthly",
    features: [
      "Unlimited content tracking",
      "Advanced analytics",
      "Custom playlists",
      "Priority support",
      "Early access to new features",
    ],
  },
  {
    name: "Pro Annual",
    description: "Best value for serious users",
    price: "$99.99",
    interval: "year",
    priceId: "price_pro_yearly",
    features: [
      "All Pro features",
      "2 months free",
      "Exclusive content insights",
      "API access",
      "Team collaboration tools",
    ],
  },
];

export default function BillingContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const handleCheckout = async (priceId: string) => {
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
      setLoading(null);
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("This is a demo version. Stripe integration coming soon!");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {success && (
        <div className="lg:col-span-2 p-4 bg-green-50 text-green-700 rounded-lg">
          Thanks for subscribing! You now have access to all Pro features.
        </div>
      )}
      {canceled && (
        <div className="lg:col-span-2 p-4 bg-amber-50 text-amber-700 rounded-lg">
          Your subscription was canceled. Feel free to try again when you're ready.
        </div>
      )}
      
      {plans.map((plan) => (
        <Card key={plan.priceId} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-baseline justify-between">
              <span>{plan.name}</span>
              <span className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.interval}
                </span>
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleCheckout(plan.priceId)}
              disabled={!!loading}
            >
              {loading === plan.priceId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Subscribe ${plan.interval === 'year' ? 'Annually' : 'Monthly'}`
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}