import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Difficulty } from '@/services/types/exercise';
import { Button, Checkbox, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface AISuggestFormData {
  difficulty: Difficulty;
  // content: string;
  typeAnswer?: string;
  includeFile?: boolean;
}

interface AISuggestFormProps {
  typeAnswer?: boolean;
  topicTitle?: string;
}

export interface AISuggestFormRef {
  getData: () => AISuggestFormData | null;
}

const AISuggestForm = forwardRef<AISuggestFormRef, AISuggestFormProps>(
  ({ typeAnswer = false, topicTitle }, ref) => {
    const [difficulty, setDifficulty] = useState<Difficulty>(
      'beginner' as Difficulty,
    );
    const [exerciseType, setExerciseType] = useState<'image' | 'audio'>(
      'image',
    );

    useImperativeHandle(ref, () => ({
      getData: () => {
        // if (!contentRef.current) return null;
        // const content = contentRef.current.value.trim();
        // if (!content) return null;

        return {
          difficulty,
          // content,
          typeAnswer: typeAnswer ? exerciseType : undefined,
          // includeFile: typeAnswer ? includeFile : undefined,
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

        {typeAnswer && (
          <div className="w-full">
            {/* Exercise Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Exercise Type
              </label>
              <Select
                selectedKeys={[exerciseType]}
                onSelectionChange={(keys) => {
                  const type = Array.from(keys)[0] as 'image' | 'audio';
                  setExerciseType(type);
                }}
                placeholder="Select exercise type"
                startContent={
                  <Icon
                    icon={
                      exerciseType === 'image' ? 'mdi:image' : 'mdi:volume-high'
                    }
                    className="text-gray-400"
                  />
                }
                aria-label="Exercise Type"
              >
                <SelectItem
                  key="image"
                  startContent={<Icon icon="mdi:image" />}
                >
                  Image Exercise
                </SelectItem>
                <SelectItem
                  key="audio"
                  startContent={<Icon icon="mdi:volume-high" />}
                >
                  Audio Exercise
                </SelectItem>
              </Select>
            </div>
            {/* <Checkbox
              size="sm"
              isSelected={includeFile}
              onValueChange={setIncludeFile}
            >
              Include Generate File
            </Checkbox> */}
          </div>
        )}

        {/* <div className="w-full">
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
        </div> */}
      </div>
    );
  },
);

export default AISuggestForm;
