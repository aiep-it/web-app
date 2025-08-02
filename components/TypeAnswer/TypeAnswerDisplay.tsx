'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ExerciseData } from '@/services/types/exercise';
import { getCmsAssetUrl } from '@/utils/index';

interface TypeAnswerDisplayProps {
  exercise: ExerciseData;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  showResult: boolean;
  isCorrect: boolean;
  onSubmit?: () => void;
}

export function TypeAnswerDisplay({ 
  exercise, 
  userAnswer, 
  onAnswerChange, 
  showResult, 
  isCorrect,
  onSubmit
}: TypeAnswerDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = () => {
    const audioUrl = exercise.audioUrl || (exercise.assetId ? getCmsAssetUrl(exercise.assetId) : null);
    if (audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'mdi:signal';
      case 'intermediate': return 'mdi:signal';
      case 'advanced': return 'mdi:signal';
      default: return 'mdi:signal';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <Icon 
            icon={exercise.type === 'image' ? 'mdi:image' : 'mdi:volume-high'} 
            className="text-purple-500 text-2xl" 
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Type Answer Exercise</h3>
            <p className="text-sm text-gray-500">
              {exercise.type === 'image' ? 'Look at the image' : 'Listen to the audio'} and type your answer
            </p>
          </div>
        </div>
        
        {exercise.difficulty && (
          <Chip
            color={getDifficultyColor(exercise.difficulty)}
            variant="flat"
            startContent={<Icon icon={getDifficultyIcon(exercise.difficulty)} />}
          >
            {exercise.difficulty}
          </Chip>
        )}
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Question Content */}
        {exercise.content && (
          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-800">Question:</h4>
            <p className="text-gray-700 leading-relaxed">{exercise.content}</p>
          </div>
        )}

        {/* Media Display */}
        {exercise.type === 'image' && (exercise.imageUrl || exercise.assetId) && (
          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-800">Image:</h4>
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={exercise.imageUrl || getCmsAssetUrl(exercise.assetId)}
                alt="Exercise"
                className="w-full h-auto max-h-96 object-contain bg-gray-50"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                }}
              />
            </div>
          </div>
        )}

        {exercise.type === 'audio' && (exercise.audioUrl || exercise.assetId) && (
          <div className="space-y-2">
            <h4 className="text-md font-medium text-gray-800">Audio:</h4>
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-200">
              <Button
                color="primary"
                size="lg"
                isLoading={isPlaying}
                onPress={handleAudioPlay}
                startContent={!isPlaying && <Icon icon="mdi:play" className="text-xl" />}
                className="px-8"
              >
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </Button>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-800">Your Answer:</h4>
          <Input
            value={userAnswer}
            onValueChange={onAnswerChange}
            placeholder="Type your answer here..."
            size="lg"
            startContent={<Icon icon="mdi:pencil" className="text-gray-400" />}
            isDisabled={showResult}
            classNames={{
              input: "text-lg",
              inputWrapper: showResult 
                ? isCorrect 
                  ? "border-2 border-green-500 bg-green-50" 
                  : "border-2 border-red-500 bg-red-50"
                : "border-2 border-gray-200 hover:border-purple-300 focus-within:border-purple-500"
            }}
          />
          
          {!showResult && onSubmit && (
            <Button
              color="primary"
              onPress={onSubmit}
              isDisabled={!userAnswer.trim()}
              startContent={<Icon icon="mdi:check" />}
              className="w-full"
            >
              Submit Answer
            </Button>
          )}
        </div>

        {/* Result Display */}
        {showResult && (
          <div className={`p-4 rounded-lg border-2 ${
            isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <Icon 
                icon={isCorrect ? 'mdi:check-circle' : 'mdi:close-circle'} 
                className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              />
              <div className="flex-1">
                <h5 className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h5>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect 
                    ? 'Well done! Your answer is correct.' 
                    : `The correct answer is: "${exercise.correctAnswer}"`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
