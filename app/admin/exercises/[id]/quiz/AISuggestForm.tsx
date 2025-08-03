import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Difficulty } from '@/services/types/exercise';
import { Button, Textarea } from '@heroui/react';

export interface AISuggestFormData {
  difficulty: Difficulty;
  content: string;
}

export interface AISuggestFormRef {
  getData: () => AISuggestFormData | null;
}

const AISuggestForm = forwardRef<AISuggestFormRef>((_, ref) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(
    'beginner' as Difficulty,
  );
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => ({
    getData: () => {
      if (!contentRef.current) return null;
      const content = contentRef.current.value.trim();
      if (!content) return null;

      return {
        difficulty,
        content,
      };
    },
  }));

  return (
    <div className="w-full space-y-4 flex flex-col justify-center items-center content-center">
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level
        </label>
        <div className="flex gap-2">
          {Object.values(Difficulty).map((level) => (
            <Button
              key={level}
              variant={difficulty === level ? 'solid' : 'bordered'}
              color={difficulty === level ? 'primary' : 'default'}
              size="sm"
              onPress={() => setDifficulty(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <Textarea
          ref={contentRef}
          placeholder="Enter your content for AI suggestion here..."
          minRows={3}
          maxRows={6}
          variant="bordered"
        />
      </div>
    </div>
  );
});

export default AISuggestForm;
