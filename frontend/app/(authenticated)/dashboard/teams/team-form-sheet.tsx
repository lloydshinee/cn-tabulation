"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Pencil, PlusCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Assuming Team type
export type Team = {
  id: string;
  name: string;
  description?: string;
  imageSrc?: string | null;
};

const UPLOAD_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`;
const TEAM_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`;

export default function TeamFormSheet({ data }: { data?: Team }) {
  const [name, setName] = useState<string>(data?.name ?? "");
  const [description, setDescription] = useState<string>(
    data?.description ?? ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load initial image preview from data
  useEffect(() => {
    if (data?.imageSrc) {
      setImagePreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.imageSrc}`);
    }
  }, [data]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const input = document.getElementById("team-image") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Team name is required.");
      return;
    }

    setLoading(true);
    try {
      let teamId = data?.id ?? null;

      // Step 1: Create or update team without image
      const payload = {
        name,
        description,
        imageSrc: data?.imageSrc ?? null, // temporarily null
      };

      if (data) {
        // Update existing team first
        await axios.put(`${TEAM_URL}/${data.id}`, payload);
        toast.success("Team updated successfully!");
      } else {
        // Create new team first
        const createRes = await axios.post(TEAM_URL, payload);
        teamId = createRes.data.id; // save new team id
        toast.success("Team created successfully!");
      }

      // Step 2: Upload image if provided
      if (imageFile && teamId) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("teamId", teamId);
        formData.append("oldImagePath", data?.imageSrc ?? "");

        const uploadRes = await axios.post(`${UPLOAD_URL}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update team with uploaded image path
        await axios.put(`${TEAM_URL}/${teamId}`, {
          imageSrc: uploadRes.data.path,
        });
      }

      // Reset form if creating
      if (!data) {
        setName("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {data ? (
          <Button size="icon" variant="ghost" aria-label="Edit Team">
            <Pencil className="h-5 w-5" />
          </Button>
        ) : (
          <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 shadow">
            <PlusCircle className="h-5 w-5" />
            Add Team
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{data ? "Edit Team" : "Add Team"}</SheetTitle>
          <SheetDescription>
            {data
              ? "Update this team's details."
              : "Fill in the form to add a new team."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 text-sm">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="relative w-full">
                <div className="h-full w-full overflow-hidden border border-gray-300 bg-gray-100 rounded-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Team image"
                      className="h-full w-full max-h-40 object-cover"
                    />
                  ) : (
                    <div className="flex w-full h-40 items-center justify-center text-gray-400">
                      <Upload size={24} />
                    </div>
                  )}
                </div>

                {imagePreview ? (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <Label
                    htmlFor="team-image"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <PlusCircle size={16} />
                  </Label>
                )}

                <Input
                  id="team-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <span className="text-xs text-gray-500">Team Image</span>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="team-name">Name</Label>
              <Input
                id="team-name"
                placeholder="Enter team name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                placeholder="Enter team description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </form>
        </div>

        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading
              ? data
                ? "Updating..."
                : "Creating..."
              : data
              ? "Update Team"
              : "Create Team"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
