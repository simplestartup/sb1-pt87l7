import { redirect } from "next/navigation";

// Redirect dashboard root to marketing page for now
// In a real app, this would check authentication
export default function DashboardPage() {
  redirect("/");
}