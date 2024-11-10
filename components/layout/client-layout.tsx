"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-16 md:pt-8 pb-8 w-full">
          <ThemeToggle />
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}