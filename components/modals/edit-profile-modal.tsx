"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfileSchema, UpdateProfileSchema } from "@/schema/auth";
import axios from "axios";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";
import { MediaPicker } from "@/components/media-picker";
import { ImageIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { user, fetchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
      password: "",
    },
  });

  const onSubmit = async (data: UpdateProfileSchema) => {
    setLoading(true);
    try {
      // If password is empty, remove it from submission
      if (!data.password) {
        delete data.password;
      }

      await axios.patch("/api/auth/me", data);
      await fetchUser();
      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const initial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const currentImage = form.watch("image");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-y-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={currentImage || undefined} />
                    <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
                </Avatar>
                
                {showImagePicker ? (
                     <div className="w-full">
                        <MediaPicker onChange={(url) => {
                            form.setValue("image", url);
                            setShowImagePicker(false);
                        }} />
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setShowImagePicker(false)}
                            className="w-full mt-2"
                        >
                            Cancel Image Update
                        </Button>
                     </div>
                ) : (
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowImagePicker(true)}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Change Image
                    </Button>
                )}
            </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
            />
             {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
             )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">New Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Leave blank to keep current"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
             )}
          </div>

          <div className="flex justify-end gap-x-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
