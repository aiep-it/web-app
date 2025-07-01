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

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
      onSelect?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileInputRef}
        accept="image/*"
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
          <img
            alt="Preview"
            className="object-cover w-full h-full"
            src={previewUrl}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Icon className="w-12 h-12" icon="mdi:image-outline" />
            <span className="text-sm mt-1">Select an image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CImageUpload;
