"use client";

import { useState, useRef } from "react";
import { uploadToImgBB } from "@/app/actions/imgbb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal";
import { toast } from "sonner";
import {
  Loader2,
  UploadCloud,
  Image as ImageIcon
} from "lucide-react";

interface ImgBBPickerProps {
  onChange: (url: string) => void;
}

export const ImgBBPicker = ({ onChange }: ImgBBPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadToImgBB(formData);
      console.log(result)
      if(result.error) {
        toast.error(result.error || "Failed to upload image");
        return;
      }

      if (result.url) {
        onChange(result.url);
        toast.success("Image uploaded successfully");
        setIsOpen(false);
        setPreview(null);
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>
        <Button type="button" variant="outline" className="w-full h-24 border-dashed border-2 flex flex-col gap-2 items-center justify-center text-muted-foreground hover:text-foreground">
          <UploadCloud className="w-8 h-8" />
          <span>Upload to ImgBB</span>
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Upload Image</ModalTitle>
        </ModalHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Input 
                ref={fileInputRef} 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading} 
              />
            </div>

            {preview && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-slate-100">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            <Button 
              type="button" 
              onClick={handleUpload} 
              disabled={isUploading || !preview}
              className="w-full"
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload & Select"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
