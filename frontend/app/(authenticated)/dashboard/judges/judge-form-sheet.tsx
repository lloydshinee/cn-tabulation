"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "next-auth";

const UPLOAD_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`;
const JUDGE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/judges`;

export default function JudgeFormSheet({ data }: { data?: User }) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.imageSrc ?? null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState<string>(data?.fullName ?? "");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>(data?.username ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setFullName(data.fullName);
      setUsername(data.username);
      setImagePreview(
        data.imageSrc
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.imageSrc}`
          : null
      );
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
    setImagePreview(null);
    setImageFile(null);
    const fileInput = document.getElementById(
      "profile-image"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (!username || !fullName) {
      toast.error("Please enter both username and name.");
      return;
    }

    setLoading(true);

    try {
      let judgeId = data?.id ?? null;

      // Step 1: Create or update judge without image
      const judgePayload = {
        username,
        fullName,
        password: password || undefined,
        imageSrc: data?.imageSrc ?? null, // temporarily keep existing or null
        role: "JUDGE",
      };

      if (data) {
        await axios.put(`${JUDGE_URL}/${data.id}`, judgePayload);
        judgeId = data.id;
        toast.success("Judge updated successfully!");
      } else {
        const createRes = await axios.post(JUDGE_URL, judgePayload);
        judgeId = createRes.data.id;
        toast.success("Judge added successfully!");
      }

      // Step 2: Upload new image if selected
      if (imageFile && judgeId) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("judgeId", judgeId);
        formData.append("oldImagePath", data?.imageSrc ?? "");

        const uploadRes = await axios.post(UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update judge with new image path
        await axios.put(`${JUDGE_URL}/${judgeId}`, {
          imageSrc: uploadRes.data.path,
        });
      }

      // Reset form if creating
      if (!data) {
        setUsername("");
        setFullName("");
        setPassword("");
        setImageFile(null);
        setImagePreview(null);
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add/update judge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {data ? (
          <Button size="icon" variant="ghost" aria-label="Edit Judge">
            <Pencil className="h-5 w-5 text-primary" />
          </Button>
        ) : (
          <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 shadow">
            <PlusCircle className="h-5 w-5" />
            Add Judge
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{data ? "Edit Judge" : "Add Judge"}</SheetTitle>
          <SheetDescription>
            Fill in the details below to {data ? "update" : "add"} a judge.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 text-sm">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="relative w-full">
                <div className="h-full w-full overflow-hidden border border-gray-300 bg-gray-100 rounded-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Judge image"
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
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <PlusCircle size={16} />
                  </Label>
                )}

                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <span className="text-xs text-gray-500">Profile Image</span>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={
                  data ? "Leave blank to keep current" : "Enter Password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </form>
        </div>

        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading
              ? data
                ? "Updating..."
                : "Adding..."
              : data
              ? "Update Judge"
              : "Add Judge"}
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
