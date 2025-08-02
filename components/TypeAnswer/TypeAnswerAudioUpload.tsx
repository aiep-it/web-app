'use client';

import React, { useState } from 'react';
import CAudioUpload from '@/components/CAudioUpload';
import { uploadFileToDirectus } from '@/services/cms/exercise';

interface TypeAnswerAudioUploadProps {
  onAudioUploaded: (assetId: string) => void;
  onFileSelect?: (file: File) => void; // New prop for direct file selection
  currentAudioUrl?: string;
  placeholder?: string;
}

export function TypeAnswerAudioUpload({ 
  onAudioUploaded, 
  onFileSelect,
  currentAudioUrl, 
  placeholder 
}: TypeAnswerAudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Call the file select callback if provided (for direct file handling)
      if (onFileSelect) {
        onFileSelect(file);
      }
      
      // Upload to Directus and get asset ID
      const assetId = await uploadFileToDirectus(file, 'audio');
      
      if (assetId) {
        onAudioUploaded(assetId);
      } else {
        console.error('Failed to get asset ID from upload');
        // Fallback: use file-based approach
        const tempAssetId = `temp_${Date.now()}_${file.name}`;
        onAudioUploaded(tempAssetId);
      }
    } catch (error) {
      console.error('Failed to upload audio:', error);
      // Fallback: use temporary ID for offline handling
      const tempAssetId = `temp_${Date.now()}_${file.name}`;
      onAudioUploaded(tempAssetId);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <CAudioUpload 
        onSelect={handleFileSelect}
        currentAudioUrl={currentAudioUrl}
      />
      {isUploading && (
        <p className="text-sm text-blue-500 mt-2">Uploading audio...</p>
      )}
      {placeholder && !isUploading && (
        <p className="text-sm text-gray-500 mt-2">{placeholder}</p>
      )}
    </div>
  );
}
