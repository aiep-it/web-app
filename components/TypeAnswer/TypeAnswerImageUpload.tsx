'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface TypeAnswerImageUploadProps {
  onImageUploaded: (assetId: string) => void;
  onFileSelect?: (file: File) => void; // New prop for direct file selection
  currentImageUrl?: string;
  placeholder?: string;
}

export function TypeAnswerImageUpload({ 
  onImageUploaded, 
  onFileSelect,
  currentImageUrl, 
  placeholder 
}: TypeAnswerImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      setSelectedFile(file);
      
      // Call the file select callback if provided
      if (onFileSelect) {
        onFileSelect(file);
      }
      
      // For backward compatibility, if onImageUploaded is expected to handle upload
      // You would implement actual upload logic here
      const tempAssetId = `temp_${Date.now()}_${file.name}`;
      onImageUploaded(tempAssetId);
    } catch (error) {
      console.error('Failed to handle image selection:', error);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="light"
                onPress={handleClick}
                startContent={<Icon icon="mdi:image-edit" />}
              >
                Change Image
              </Button>
              {selectedFile && (
                <span className="text-sm text-gray-500 self-center">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Icon icon="mdi:image-plus" className="text-gray-400 text-4xl mx-auto mb-4" />
            <Button
              onPress={handleClick}
              startContent={<Icon icon="mdi:upload" />}
            >
              Upload Image
            </Button>
            {placeholder && (
              <p className="text-sm text-gray-500 mt-2">{placeholder}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
