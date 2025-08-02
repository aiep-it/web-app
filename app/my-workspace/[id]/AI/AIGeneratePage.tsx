import { TopicData } from '@/services/types/topic';
import { genByImage } from '@/services/vocab';
import { Input } from '@heroui/react';

import React from 'react';
interface AIGeneratePageProps {
  topic?: TopicData;
}

const AIGeneratePage: React.FC<AIGeneratePageProps> = ({ topic }) => {
  const onGetAIContent = async (file: File | null) => {
    if (!file) return;
    const res = await genByImage(file);
  };
  return (
    <div>
      <Input
        id="background-upload"
        type="file"
        accept="image/*"
        onChange={(e: any) => {
          const file = e.target.files?.[0] || null;
          onGetAIContent(file);
        }}
      />
    </div>
  );
};

export default AIGeneratePage;
