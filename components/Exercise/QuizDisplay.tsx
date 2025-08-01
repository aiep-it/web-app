'use client';

import React from 'react';
import { ExerciseData } from '@/services/types/exercise';
import { Icon } from '@iconify/react';
import { Card, CardBody, CardHeader, Chip } from '@heroui/react';

interface QuizDisplayProps {
  exercise: ExerciseData;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export function QuizDisplay({ 
  exercise, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false,
  isCorrect = false 
}: QuizDisplayProps) {
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:help-circle-outline" className="text-blue-500 text-xl" />
            <span className="text-sm font-medium text-gray-600">Quiz Exercise</span>
          </div>
          <Chip size="sm" variant="flat" color="primary">
            {exercise.difficulty}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        {/* Question */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {exercise.content}
          </h2>
          
          {exercise.hint && !showResult && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Icon icon="mdi:lightbulb-outline" className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Hint:</p>
                <p className="text-sm text-yellow-700">{exercise.hint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {exercise.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === exercise.correctAnswer;
            
            let buttonStyle = 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
            let iconColor = 'text-gray-400';
            
            if (showResult) {
              if (isCorrectAnswer) {
                buttonStyle = 'border-green-500 bg-green-50 text-green-800';
                iconColor = 'text-green-500';
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle = 'border-red-500 bg-red-50 text-red-800';
                iconColor = 'text-red-500';
              }
            } else if (isSelected) {
              buttonStyle = 'border-blue-500 bg-blue-50 text-blue-800';
              iconColor = 'text-blue-500';
            }
            
            return (
              <button
                key={index}
                onClick={() => !showResult && onAnswerSelect(option)}
                disabled={showResult}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${buttonStyle} ${
                  showResult ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    showResult && isCorrectAnswer ? 'bg-green-500 text-white' :
                    showResult && isSelected && !isCorrectAnswer ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {showResult && isCorrectAnswer ? (
                      <Icon icon="mdi:check" className="text-white" />
                    ) : showResult && isSelected && !isCorrectAnswer ? (
                      <Icon icon="mdi:close" className="text-white" />
                    ) : isSelected ? (
                      <Icon icon="mdi:check" className="text-white" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  
                  <span className="font-medium flex-1">{option}</span>
                  
                  {showResult && isCorrectAnswer && (
                    <Icon icon="mdi:check-circle" className="text-green-500" />
                  )}
                  {showResult && isSelected && !isCorrectAnswer && (
                    <Icon icon="mdi:close-circle" className="text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Display */}
        {showResult && (
          <div className={`p-4 rounded-lg border-2 ${
            isCorrect 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon 
                icon={isCorrect ? "mdi:check-circle" : "mdi:close-circle"} 
                className={`text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`} 
              />
              <span className={`font-semibold ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            
            {!isCorrect && (
              <p className="text-sm text-red-700 mb-2">
                <strong>Correct answer:</strong> {exercise.correctAnswer}
              </p>
            )}
            
            {exercise.hint && (
              <p className="text-sm text-gray-600">
                <strong>Hint:</strong> {exercise.hint}
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
