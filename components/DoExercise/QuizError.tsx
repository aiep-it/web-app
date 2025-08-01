'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface QuizErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBackToLearning?: () => void;
}

export function QuizError({ 
  title = "Error Loading Quiz",
  message = "There was a problem loading the quiz. Please try again.",
  onRetry,
  onBackToLearning
}: QuizErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="mdi:alert-circle" className="text-red-500 text-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button
              color="primary"
              variant="light"
              onPress={onRetry}
              startContent={<Icon icon="mdi:refresh" />}
            >
              Try Again
            </Button>
          )}
          {onBackToLearning && (
            <Button
              color="primary"
              onPress={onBackToLearning}
              startContent={<Icon icon="mdi:arrow-left" />}
            >
              Back to Learning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
