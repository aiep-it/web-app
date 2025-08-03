'use client';

import React, { useState } from 'react';
import { ExerciseData, Difficulty, VocabColumn } from '@/services/types/exercise';
import { Icon } from '@iconify/react';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Chip } from '@heroui/react';

interface QuizEditorProps {
  exercise?: ExerciseData;
  onSave: (exerciseData: Partial<ExerciseData>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function QuizEditor({ exercise, onSave, onCancel, isLoading = false }: QuizEditorProps) {
  const [content, setContent] = useState(exercise?.content || '');
  const [options, setOptions] = useState<string[]>(exercise?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(exercise?.correctAnswer || '');
  const [hint, setHint] = useState(exercise?.hint || '');
  const [difficulty, setDifficulty] = useState(exercise?.difficulty || 'beginner');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      
      // If the removed option was the correct answer, clear it
      if (correctAnswer === options[index]) {
        setCorrectAnswer('');
      }
    }
  };

  const handleSubmit = () => {
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    
    if (!content.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (filteredOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    
    if (!correctAnswer.trim() || !filteredOptions.includes(correctAnswer)) {
      alert('Please select a valid correct answer from the options');
      return;
    }

    const exerciseData: Partial<ExerciseData> = {
      content: content.trim(),
      options: filteredOptions,
      correctAnswer: correctAnswer.trim(),
      hint: hint.trim() || undefined,
      difficulty: difficulty as Difficulty,
      type: 'text' as VocabColumn
    };

    onSave(exerciseData);
  };

  const isFormValid = () => {
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    return content.trim() && 
           filteredOptions.length >= 2 && 
           correctAnswer.trim() && 
           filteredOptions.includes(correctAnswer);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:plus-circle-outline" className="text-blue-500 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-900">
              {exercise ? 'Edit Quiz Exercise' : 'Create Quiz Exercise'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="light"
              onPress={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              disabled={!isFormValid() || isLoading}
              isLoading={isLoading}
            >
              {exercise ? 'Update' : 'Create'} Exercise
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="space-y-6">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter your quiz question here..."
              value={content}
              onValueChange={setContent}
              minRows={3}
              maxRows={6}
              variant="bordered"
            />
          </div>

          {/* Difficulty Selection */}
          <div>
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

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options <span className="text-red-500">*</span>
              </label>
              {options.length < 6 && (
                <Button
                  size="sm"
                  variant="light"
                  onPress={handleAddOption}
                  startContent={<Icon icon="mdi:plus" />}
                >
                  Add Option
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </div>
                    
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onValueChange={(value) => handleOptionChange(index, value)}
                      variant="bordered"
                      className="flex-1"
                    />
                    
                    <Button
                      isIconOnly
                      size="sm"
                      variant={correctAnswer === option ? 'solid' : 'light'}
                      color={correctAnswer === option ? 'success' : 'default'}
                      onPress={() => setCorrectAnswer(option)}
                      title="Mark as correct answer"
                    >
                      <Icon icon="mdi:check" />
                    </Button>
                  </div>
                  
                  {options.length > 2 && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleRemoveOption(index)}
                      title="Remove option"
                    >
                      <Icon icon="mdi:close" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {correctAnswer && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                <Icon icon="mdi:check-circle" className="inline mr-1" />
                Correct answer: <strong>{correctAnswer}</strong>
              </div>
            )}
          </div>

          {/* Hint (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hint (Optional)
            </label>
            <Textarea
              placeholder="Provide a helpful hint for learners..."
              value={hint}
              onValueChange={setHint}
              minRows={2}
              maxRows={4}
              variant="bordered"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
