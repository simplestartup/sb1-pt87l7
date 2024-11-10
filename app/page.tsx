import Dashboard from "@/components/dashboard/dashboard-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Lumina",
  description: "Your streaming dashboard",
};

export default function DashboardPage() {
  return <Dashboard />;
}