import React from 'react';
import { Button, Image, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  isLoading,
}) => {
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isDetaching, setIsDetaching] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSubmit = () => {
    if (image) {
      setIsDetaching(true);
      setTimeout(() => {
        onUpload(image);
        setIsDetaching(false);
      }, 500); // Delay to allow animation to complete
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary-100' : 'border-gray-300'
        } ${isLoading ? 'hidden' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="imageUpload"
        />
        {!image ? (
          <label htmlFor="imageUpload" className="cursor-pointer" >
            <div className="flex flex-col items-center">
              <Icon
                icon="lucide:upload-cloud"
                className="text-4xl text-gray-400 mb-2"
              />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </div>
          </label>
        ) : (
          <Button
            color="secondary"
            variant="flat"
            className="w-full"
            onPress={() => setImage(null)}
          >
            <Icon icon="lucide:file-pen-line" className="mr-2" />
            Change Image
          </Button>
        )}
      </div>
      <AnimatePresence>
        {preview && !isDetaching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, rotate: -10 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center relative"
          >
            <Image
              src={preview}
              alt="Uploaded preview"
              className="max-h-64 object-contain rounded-lg"
            />
            {isLoading && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-primary-200 opacity-30 overflow-hidden"
              >
                <div className="h-full w-full bg-primary-400 opacity-50 transform -skew-y-12" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center">
        {image && (
          <p className="text-sm text-gray-500">
            {image.name} ({Math.round(image.size / 1024)} KB)
          </p>
        )}
        <Button
          color="primary"
          onPress={handleSubmit}
          isDisabled={!image || isLoading || isDetaching}
          isLoading={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Generate Learning Plan'}
        </Button>
      </div>
      {isLoading && (
        <div className="flex items-center space-x-2">
          <Progress
            isIndeterminate
            aria-label="Analyzing image"
            className="max-w-md flex-grow"
            color="primary"
          />
          <span className="text-sm text-gray-500">Analyzing...</span>
        </div>
      )}
    </div>
  );
};
