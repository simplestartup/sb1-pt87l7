import { Metadata } from "next";
import { Settings as SettingsForm } from "@/components/settings/settings-form";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Settings - StreamTracker",
  description: "Manage your account settings",
};

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>
      <Separator />
      <SettingsForm />
    </div>
  );
}