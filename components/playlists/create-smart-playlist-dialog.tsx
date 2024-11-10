"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { useContentStore, type SmartPlaylistRule } from "@/lib/content-store";
import { toast } from "sonner";

interface CreateSmartPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSmartPlaylistDialog({
  open,
  onOpenChange
}: CreateSmartPlaylistDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<SmartPlaylistRule[]>([{
    field: 'type',
    operator: 'equals',
    value: ''
  }]);

  const { createSmartPlaylist } = useContentStore();

  const handleAddRule = () => {
    setRules([...rules, { field: 'type', operator: 'equals', value: '' }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof SmartPlaylistRule, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    if (!rules.every(rule => rule.value)) {
      toast.error("Please complete all rule values");
      return;
    }

    createSmartPlaylist(name.trim(), description.trim(), rules);
    toast.success("Smart playlist created successfully");
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setRules([{ field: 'type', operator: 'equals', value: '' }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Smart Playlist</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter playlist name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter playlist description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Rules</Label>
              <Button variant="outline" size="sm" onClick={handleAddRule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Select
                    value={rule.field}
                    onValueChange={(value: any) => handleRuleChange(index, 'field', value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type">Type</SelectItem>
                      <SelectItem value="genre">Genre</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="watched">Watched</SelectItem>
                      <SelectItem value="platform">Platform</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.operator}
                    onValueChange={(value: any) => handleRuleChange(index, 'operator', value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater">Greater Than</SelectItem>
                      <SelectItem value="less">Less Than</SelectItem>
                    </SelectContent>
                  </Select>

                  {rule.field === 'type' ? (
                    <Select
                      value={rule.value}
                      onValueChange={(value) => handleRuleChange(index, 'value', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="series">TV Series</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="flex-1"
                      placeholder="Enter value"
                      value={rule.value}
                      onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                    />
                  )}

                  {rules.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRule(index)}
                    >
                      <Minus className="h-4 w-4 text-red-400" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Smart Playlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}