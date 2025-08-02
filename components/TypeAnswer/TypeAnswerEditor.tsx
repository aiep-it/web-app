'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ExerciseData, Difficulty } from '@/services/types/exercise';
import { TypeAnswerImageUpload } from './TypeAnswerImageUpload';
import { TypeAnswerAudioUpload } from './TypeAnswerAudioUpload';
import { getCmsAssetUrl } from '@/utils';

interface TypeAnswerEditorProps {
  exercise?: ExerciseData;
  onSave: (exerciseData: Partial<ExerciseData>, imageFile?: File, audioFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TypeAnswerEditor({ exercise, onSave, onCancel, isLoading = false }: TypeAnswerEditorProps) {
  const [formData, setFormData] = useState({
    content: '',
    correctAnswer: '',
    type: 'image' as 'image' | 'audio',
    assetId: '', // ID of the asset from CMS
    difficulty: 'beginner' as Difficulty
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);

  useEffect(() => {
    if (exercise) {
      setFormData({
        content: exercise.content || '',
        correctAnswer: exercise.correctAnswer || '',
        type: exercise.type as 'image' | 'audio',
        assetId: exercise.assetId || '', // Asset ID from CMS
        difficulty: exercise.difficulty || ('beginner' as Difficulty)
      });
    }
  }, [exercise]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Question content is required';
    }

    if (!formData.correctAnswer.trim()) {
      newErrors.correctAnswer = 'Correct answer is required';
    }

    // Only require asset for image type exercises, audio is optional
    if (formData.type === 'image' && !formData.assetId.trim() && !selectedImageFile) {
      newErrors.assetId = 'Image asset is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const exerciseData: Partial<ExerciseData> = {
      content: formData.content,
      correctAnswer: formData.correctAnswer,
      type: formData.type as any,
      difficulty: formData.difficulty,
      assetId: formData.assetId, // CMS Asset ID
      options: [], // Type answer exercises don't have options
    };

    // Pass both image and audio files
    onSave(exerciseData, selectedImageFile || undefined, selectedAudioFile || undefined);
  };

  const handleAssetUpload = (assetId: string) => {
    setFormData(prev => ({ ...prev, assetId }));
    if (errors.assetId) {
      setErrors(prev => ({ ...prev, assetId: '' }));
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedImageFile(file);
    if (errors.assetId) {
      setErrors(prev => ({ ...prev, assetId: '' }));
    }
  };

  const handleAudioFileSelect = (file: File) => {
    setSelectedAudioFile(file);
    if (errors.assetId) {
      setErrors(prev => ({ ...prev, assetId: '' }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 pb-3">
        <Icon 
          icon={formData.type === 'image' ? 'mdi:image' : 'mdi:volume-high'} 
          className="text-purple-500 text-2xl" 
        />
        <h2 className="text-xl font-semibold text-gray-900">
          {exercise ? 'Edit' : 'Create'} Type Answer Exercise
        </h2>
      </CardHeader>
      
      <CardBody className="space-y-6">
        {/* Exercise Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Exercise Type *</label>
          <Select
            selectedKeys={[formData.type]}
            onSelectionChange={(keys) => {
              const type = Array.from(keys)[0] as 'image' | 'audio';
              setFormData(prev => ({ ...prev, type }));
            }}
            placeholder="Select exercise type"
            startContent={
              <Icon 
                icon={formData.type === 'image' ? 'mdi:image' : 'mdi:volume-high'} 
                className="text-gray-400" 
              />
            }
          >
            <SelectItem key="image" startContent={<Icon icon="mdi:image" />}>
              Image Exercise
            </SelectItem>
            <SelectItem key="audio" startContent={<Icon icon="mdi:volume-high" />}>
              Audio Exercise
            </SelectItem>
          </Select>
        </div>

        {/* Question Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Question Content *</label>
          <Textarea
            value={formData.content}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, content: value }));
              if (errors.content) {
                setErrors(prev => ({ ...prev, content: '' }));
              }
            }}
            placeholder="Enter the question or instruction..."
            minRows={3}
            maxRows={5}
            isInvalid={!!errors.content}
            errorMessage={errors.content}
          />
        </div>

        {/* Media Upload */}
        {formData.type === 'image' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image *</label>
            <TypeAnswerImageUpload
              onImageUploaded={handleAssetUpload}
              onFileSelect={setSelectedImageFile} // Use the new prop for direct file selection
              currentImageUrl={exercise?.imageUrl || (formData.assetId ? getCmsAssetUrl(formData.assetId) : undefined)}
              placeholder="Upload an image for the exercise"
            />
            {errors.assetId && (
              <p className="text-sm text-red-500">{errors.assetId}</p>
            )}
          </div>
        )}

        {formData.type === 'audio' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Audio (Optional)</label>
            <TypeAnswerAudioUpload
              onAudioUploaded={handleAssetUpload}
              onFileSelect={handleAudioFileSelect}
              currentAudioUrl={exercise?.audioUrl || (formData.assetId ? getCmsAssetUrl(formData.assetId) : undefined)}
              placeholder="Upload an audio file for the exercise (optional)"
            />
            {errors.assetId && (
              <p className="text-sm text-red-500">{errors.assetId}</p>
            )}
          </div>
        )}

        {/* Correct Answer */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Correct Answer *</label>
          <Input
            value={formData.correctAnswer}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, correctAnswer: value }));
              if (errors.correctAnswer) {
                setErrors(prev => ({ ...prev, correctAnswer: '' }));
              }
            }}
            placeholder="Enter the correct answer..."
            startContent={<Icon icon="mdi:check-circle" className="text-green-500" />}
            isInvalid={!!errors.correctAnswer}
            errorMessage={errors.correctAnswer}
          />
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
          <Select
            selectedKeys={[formData.difficulty]}
            onSelectionChange={(keys) => {
              const difficulty = Array.from(keys)[0] as Difficulty;
              setFormData(prev => ({ ...prev, difficulty }));
            }}
            placeholder="Select difficulty"
            startContent={<Icon icon="mdi:signal" className="text-gray-400" />}
          >
            <SelectItem key="beginner" startContent={<Icon icon="mdi:signal" className="text-green-500" />}>
              Beginner
            </SelectItem>
            <SelectItem key="intermediate" startContent={<Icon icon="mdi:signal" className="text-yellow-500" />}>
              Intermediate
            </SelectItem>
            <SelectItem key="advanced" startContent={<Icon icon="mdi:signal" className="text-red-500" />}>
              Advanced
            </SelectItem>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="light"
            onPress={onCancel}
            startContent={<Icon icon="mdi:close" />}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon="mdi:check" />}
          >
            {exercise ? 'Update' : 'Create'} Exercise
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
