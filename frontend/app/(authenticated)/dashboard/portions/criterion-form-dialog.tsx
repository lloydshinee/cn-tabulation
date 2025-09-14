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
import { Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Criterion } from "@/lib/globals";
import { Textarea } from "@/components/ui/textarea";

const CRITERION_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/criterion`;

export default function CriterionFormDialog({
  data,
  criteriaId,
}: {
  data?: Criterion;
  criteriaId: number;
}) {
  const [name, setName] = useState<string>(data?.name ?? "");
  const [description, setDescription] = useState<string>(
    data?.description ?? ""
  );
  const [weight, setWeight] = useState<string>(data?.weight.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWeightChange = (value: string) => {
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100)
    ) {
      setWeight(value);
    }
  };

  useEffect(() => {
    if (data) {
      setName(data.name);
      setDescription(data.description || "");
      setWeight(data.weight.toString());
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!name || !weight) {
      toast.error("Fields are required.");
      return;
    }

    setLoading(true);

    try {
      const criterionPayload = {
        name,
        description,
        weight,
        criteriaId,
      };

      if (data) {
        // ✅ Update portion
        await axios.put(`${CRITERION_URL}/${data.id}`, criterionPayload);
        toast.success("Criterion updated successfully!");
      } else {
        // ✅ Create portion
        await axios.post(CRITERION_URL, criterionPayload);
        toast.success("Criterion created successfully!");

        // Reset form
        setName("");
        setDescription("");
        setWeight("");
      }

      router.refresh();
      // ✅ Close dialog
      const closeButton = document.querySelector<HTMLButtonElement>(
        "[data-dialog-close]"
      );
      closeButton?.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save criterion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {data ? (
          <Button variant="ghost" size="sm" className="h-6 px-1">
            <Edit className="h-3 w-3" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Criterion
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Criterion" : "Add Criterion"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {data ? "update" : "add"} a criterion.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="criterion-name">Description</Label>
            <Input
              id="criterion-name"
              inputMode="decimal"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter criterion name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="criterion-description">Description</Label>
            <Textarea
              id="criterion-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter criterion description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="criterion-weight">Weight</Label>
            <Input
              id="criterion-weight"
              value={weight}
              type="text"
              inputMode="decimal"
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="Enter criterion weight"
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
              ? "Update Criterion"
              : "Save Criterion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
