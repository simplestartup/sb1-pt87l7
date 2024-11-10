"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddContentDialog from "./add-content-dialog";

export default function DashboardHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Lumina</h1>
        <p className="text-muted-foreground">
          Your intelligent streaming companion
        </p>
      </div>

      <Button 
        onClick={() => setShowAddDialog(true)}
        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Content
      </Button>

      <AddContentDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
}