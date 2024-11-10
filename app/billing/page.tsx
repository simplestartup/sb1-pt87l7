import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Sparkles, Zap } from "lucide-react";
import { PricingCards } from "@/components/billing/pricing-cards";
import { BillingHistory } from "@/components/billing/billing-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "AI-Powered Recommendations",
    description: "Get personalized content suggestions based on your watching patterns",
    pro: "Advanced AI with 95% accuracy",
    free: "Basic recommendations"
  },
  {
    title: "Content Library",
    description: "Track and organize your movies, shows, and podcasts",
    pro: "Unlimited content",
    free: "Up to 50 items"
  },
  {
    title: "Smart Playlists",
    description: "Create dynamic playlists that automatically update",
    pro: "Unlimited smart playlists",
    free: "Basic playlists only"
  },
  {
    title: "Watch Statistics",
    description: "Track your watching habits and preferences",
    pro: "Advanced analytics and insights",
    free: "Basic stats only"
  },
  {
    title: "Cross-Platform Sync",
    description: "Keep your content in sync across devices",
    pro: "Real-time sync",
    free: "Daily sync"
  },
  {
    title: "Content Sharing",
    description: "Share your collections with friends",
    pro: "Public and private sharing",
    free: "Limited sharing"
  }
];

export default function BillingPage() {
  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5" />
            <Badge variant="secondary" className="bg-white/20 border-white/40 text-white">
              Limited Time Offer
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Upgrade to Lumina Pro
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mb-6">
            Take your streaming experience to the next level with advanced AI insights, 
            unlimited tracking, and premium features designed for true entertainment enthusiasts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="bg-white/20 border-white/40 text-white">
              <Check className="h-4 w-4 mr-1" /> Advanced AI Insights
            </Badge>
            <Badge variant="secondary" className="bg-white/20 border-white/40 text-white">
              <Check className="h-4 w-4 mr-1" /> Unlimited Content
            </Badge>
            <Badge variant="secondary" className="bg-white/20 border-white/40 text-white">
              <Check className="h-4 w-4 mr-1" /> Priority Support
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="features">Compare Features</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-8">
          <PricingCards />
          <BillingHistory />
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
              <CardDescription>
                See what's included in each plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="grid gap-4 p-4 rounded-lg bg-muted/50">
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Free</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature.free}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">Pro</div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <Zap className="h-3 w-3 mr-1" />
                            Upgraded
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature.pro}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}