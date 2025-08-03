'use client';
import { TopicData } from '@/services/types/topic';
import { aiGenerate, genByImage } from '@/services/vocab';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import React from 'react';
// import { ImageUploader } from './components/ImageUploader';
import {
  PersonalLearning,
  PersonalLearningCreatePayload,
} from '@/services/types/workspace';
import toast from 'react-hot-toast';
// import { PersonalLearningPreview } from './components/PersonalLearningPreview';
import { uploadFile } from '@/services/cms';
import { createPersonalLearning } from '@/services/personalLearning';
import { ImageUploader } from './ImageUploader';
import { PersonalLearningPreview } from './PersonalLearningPreview';
interface AIGeneratePageProps {
  topic?: TopicData;
  onSuccess: () => void;
}

const AIGeneratePage: React.FC<AIGeneratePageProps> = ({ topic, onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [preview, setPreview] = React.useState<PersonalLearning | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const onGetAIContent = async (file: File | null) => {
    setIsLoading(true);
    if (!file) return;
    setImageFile(file);
    const res = await genByImage(file);
    if (res && res.data) {
      const personalLearning = res.data as PersonalLearning;

      setPreview(personalLearning);
      // onSuccess();
    } else {
      toast.error('Failed to generate content from image. Please try again.');
    }
    setIsLoading(false);
  };

  const uploadImageCms = async (file: File) => {
    const fileId = await uploadFile(file);

    if (fileId) {
      return fileId;
    }
    return null;
  };
  const onAddToWorkspace = async () => {
    if (!preview || !imageFile) {
      toast.error('No preview available to add to workspace.');
      return;
    }
    setIsLoading(true);
    const imageId = await uploadImageCms(imageFile);
    if (!imageId) {
      toast.error('Failed to upload image. Please try again.');
      setIsLoading(false);
      return;
    }
    preview.vocabs = preview?.vocabs?.map((vocab) => {
      return {
        ...vocab,
        topicId: topic?.id || '',
      };
    });

    const payload: PersonalLearningCreatePayload = {
      ...preview,
      topicId: topic?.id || '',
      image: imageId,
    };
    const res = await createPersonalLearning(payload);
    if (res) {
      toast.success('Added to workspace successfully!');
      setPreview(null);
      setIsLoading(false);
      onSuccess();
    } else {
      toast.error('Failed to add to workspace. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background w-full flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Image Upload Learning Plan</h1>

         
          {preview && (
            <Button
              color="primary"
              variant="light"
              startContent={<Icon icon="lucide:arrow-left" />}
              onPress={() => {
                setPreview(null);
                setIsLoading(false);
                setImageFile(null);
              }}
            >
              Upload Another Image
            </Button>
          )}
        </CardHeader>
        <CardBody>
          {!preview ? (
            <ImageUploader onUpload={onGetAIContent} isLoading={isLoading} />
          ) : (
            <PersonalLearningPreview personalLearning={preview} />
          )}
        </CardBody>
        {preview && (
          <CardFooter className="flex justify-end">
            <Button color="secondary" onPress={() => onAddToWorkspace()}>
              Add to My Workspace
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AIGeneratePage;
