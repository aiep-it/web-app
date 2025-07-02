"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

interface CUpdateImageInputProps {
  onSelect?: (file: File) => void;
  initialUrl?: string;
}

const CImageUpload: React.FC<CUpdateImageInputProps> = ({
  onSelect,
  initialUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
      // Auto-detect type by extension for initialUrl if needed
      const isVideo = initialUrl.match(/\.(mp4|webm|ogg)$/i);
      setPreviewType(isVideo ? "video" : "image");
    }
  }, [initialUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      if (file.type.startsWith("image/")) {
        setPreviewType("image");
      } else if (file.type.startsWith("video/")) {
        setPreviewType("video");
      }

      onSelect?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileInputRef}
        accept="image/*,video/*"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
      <div
        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        {previewUrl ? (
          previewType === "image" ? (
            <img
              alt="Preview"
              className="object-cover w-full h-full"
              src={previewUrl}
            />
          ) : (
            <video
              className="object-cover w-full h-full"
              src={previewUrl}
              controls
            />
          )
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Icon className="w-12 h-12" icon="mdi:image-outline" />
            <span className="text-sm mt-1">Select an image or video</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CImageUpload;
