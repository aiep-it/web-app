'use client';

import React from 'react';
import CImageUpload from '@/components/CImageUpload';

interface TypeAnswerImageUploadProps {
  onImageUploaded: (assetId: string) => void;
  currentImageUrl?: string;
  placeholder?: string;
}

export function TypeAnswerImageUpload({ 
  onImageUploaded, 
  currentImageUrl, 
  placeholder 
}: TypeAnswerImageUploadProps) {
  const handleFileSelect = async (file: File) => {
    // TODO: Upload file to CMS and get asset ID
    // For now, we'll use a placeholder implementation
    try {
      // This would be replaced with actual CMS upload logic
      // const assetId = await uploadToCMS(file);
      
      // Placeholder: use file name as temporary ID
      const tempAssetId = `temp_${Date.now()}_${file.name}`;
      onImageUploaded(tempAssetId);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <div className="w-full">
      <CImageUpload
        onSelect={handleFileSelect}
        initialUrl={currentImageUrl}
      />
      {placeholder && (
        <p className="text-sm text-gray-500 mt-2">{placeholder}</p>
      )}
    </div>
  );
}
