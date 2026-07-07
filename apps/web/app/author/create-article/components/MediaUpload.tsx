"use client";

import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export interface UploadedMedia {
  url: string;
  thumbnailUrl: string;
  type: "IMAGE" | "VIDEO";
}

interface MediaUploadProps {
  value: UploadedMedia | null;
  onChange: (media: UploadedMedia | null) => void;
  disabled?: boolean;
}

export default function MediaUpload({
  value,
  onChange,
  disabled,
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.url) {
          onChange({
            url: data.url,
            thumbnailUrl: data.thumbnailUrl,
            type: data.type,
          });

          toast.success("Fichier téléchargé avec succès");
        } else {
          toast.error(data.error || "Échec du téléchargement");
        }
      } catch (error) {
        console.error(error);
        toast.error("Une erreur est survenue lors du téléchargement");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: disabled || isUploading,
  });

  const hasMedia = !!value?.url;
  const isVideo = value?.type === "VIDEO" && hasMedia;

  return (
    <div className="w-full space-y-4">
      {hasMedia ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          {isVideo ? (
            <video
              src={value.url}
              controls
              className="h-full w-full object-cover"
            />
          ) : (
            <Image fill src={value.url} alt="Upload" className="object-cover" />
          )}

          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-destructive hover:bg-destructive/90 absolute top-2 right-2 rounded-full p-1 text-white shadow-sm transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "text-muted-foreground hover:border-primary/50 hover:bg-accent/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragActive && "border-primary bg-accent",
            (disabled || isUploading) && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <Upload className="h-10 w-10" />
          )}

          <div className="text-center">
            <p className="font-medium">
              {isDragActive
                ? "Déposez le fichier ici"
                : "Cliquez ou glissez une image ou une vidéo"}
            </p>

            <p className="text-xs">Images : JPEG, PNG, WebP, GIF (5MB max)</p>

            <p className="text-xs">Vidéos : MP4, WebM, MOV (100MB max)</p>
          </div>
        </div>
      )}
    </div>
  );
}
