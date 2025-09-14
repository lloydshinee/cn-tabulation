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
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Criteria } from "@/lib/globals";
import { Textarea } from "@/components/ui/textarea";

const CRITERIA_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/criteria`;

export default function CriteriaFormDialog({
  data,
  portionId,
}: {
  data?: Criteria;
  portionId: number;
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
      setDescription(data.description ?? "");
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
      const criteriaPayload = {
        name,
        description,
        weight,
        portionId,
      };

      if (data) {
        // ✅ Update portion
        await axios.put(`${CRITERIA_URL}/${data.id}`, criteriaPayload);
        toast.success("Criteria updated successfully!");
      } else {
        // ✅ Create portion
        await axios.post(CRITERIA_URL, criteriaPayload);
        toast.success("Criteria created successfully!");

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
      toast.error("Failed to save criteria");
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
            Edit Criteria
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Criteria
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Criteria" : "Add Criteria"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {data ? "update" : "add"} a criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="criteria-name">Name</Label>
            <Input
              id="criteria-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter criteria name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="criteria-description">Description</Label>
            <Textarea
              id="criteria-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter criteria description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="criteria-weight">Weight</Label>
            <Input
              id="criteria-weight"
              inputMode="decimal"
              value={weight}
              type="text"
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="Enter criteria weight"
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
              ? "Update Criteria"
              : "Save Criteria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
