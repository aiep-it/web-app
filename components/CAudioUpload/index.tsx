"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";

interface CAudioUploadProps {
  onSelect?: (file: File) => void;
}

const CAudioUpload: React.FC<CAudioUploadProps> = ({ onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("audio/")) {
      setAudioUrl(URL.createObjectURL(file));
      onSelect?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <input
        ref={fileInputRef}
        accept="audio/*"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
      <div
        className="w-full max-w-md h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:border-blue-500 transition-colors cursor-pointer px-4"
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        {audioUrl ? (
          <audio controls className="w-full" src={audioUrl}>
            <track kind="captions" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Icon className="w-8 h-8" icon="mdi:music-note-outline" />
            <span className="text-sm mt-1">Click to select audio</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CAudioUpload;
