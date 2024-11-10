import { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Profile - StreamTracker",
  description: "Manage your profile settings",
};

export default function ProfilePage() {
  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}