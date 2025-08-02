'use client';

import React from 'react';
import CAudioUpload from '@/components/CAudioUpload';

interface TypeAnswerAudioUploadProps {
  onAudioUploaded: (assetId: string) => void;
  currentAudioUrl?: string;
  placeholder?: string;
}

export function TypeAnswerAudioUpload({ 
  onAudioUploaded, 
  currentAudioUrl, 
  placeholder 
}: TypeAnswerAudioUploadProps) {
  const handleFileSelect = async (file: File) => {
    // TODO: Upload file to CMS and get asset ID
    // For now, we'll use a placeholder implementation
    try {
      // This would be replaced with actual CMS upload logic
      // const assetId = await uploadToCMS(file);
      
      // Placeholder: use file name as temporary ID
      const tempAssetId = `temp_${Date.now()}_${file.name}`;
      onAudioUploaded(tempAssetId);
    } catch (error) {
      console.error('Failed to upload audio:', error);
    }
  };

  return (
    <div className="w-full">
      <CAudioUpload onSelect={handleFileSelect} />
      {placeholder && (
        <p className="text-sm text-gray-500 mt-2">{placeholder}</p>
      )}
    </div>
  );
}
