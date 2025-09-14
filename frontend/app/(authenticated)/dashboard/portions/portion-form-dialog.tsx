"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Portion } from "@/lib/globals";

const PORTION_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/portions`;

export default function PortionFormDialog({ data }: { data?: Portion }) {
  const [name, setName] = useState<string>(data?.name ?? "");
  const [description, setDescription] = useState<string>(
    data?.description ?? ""
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setDescription(data.description);
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Name is required.");
      return;
    }

    setLoading(true);

    try {
      const portionPayload = {
        name,
        description,
      };

      if (data) {
        // ✅ Update portion
        await axios.put(`${PORTION_URL}/${data.id}`, portionPayload);
        toast.success("Portion updated successfully!");
      } else {
        // ✅ Create portion
        await axios.post(PORTION_URL, portionPayload);
        toast.success("Portion created successfully!");

        // Reset form
        setName("");
        setDescription("");
      }

      router.refresh();
      // ✅ Close dialog
      const closeButton = document.querySelector<HTMLButtonElement>(
        "[data-dialog-close]"
      );
      closeButton?.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save portion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {data ? (
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-8">
            <Pencil className="h-5 w-5" />
            Edit Portion
          </Button>
        ) : (
          <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 shadow">
            <PlusCircle className="h-5 w-5" />
            Add Portion
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Portion" : "Add Portion"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {data ? "update" : "add"} a portion.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="portion-name">Name</Label>
            <Input
              id="portion-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter portion name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="portion-description">Description</Label>
            <Textarea
              id="portion-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter portion description"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" data-dialog-close>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? data
                ? "Updating..."
                : "Saving..."
              : data
              ? "Update Portion"
              : "Save Portion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
