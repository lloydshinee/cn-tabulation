"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/globals";

export default function DeleteButton({
  type,
  id,
  route,
  title,
}: {
  type: "sm" | "icon";
  id: number;
  route: string;
  title?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/${route}/${id}`);
      toast.success(`${title} deleted successfully!`);
      // maybe refresh the list after deletion
      setLoading(true);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${title}`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={type}
          className="justify-start gap-2 h-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
          {title && `Delete ${title}`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
