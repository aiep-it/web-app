'use client';

import React from 'react';
import { Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

interface QuizLoadingProps {
  message?: string;
}

export function QuizLoading({ message = "Loading quiz questions..." }: QuizLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Icon icon="mdi:quiz" className="text-white text-2xl" />
        </div>
        <Spinner size="lg" color="primary" />
        <h2 className="text-xl font-medium text-gray-700 mt-4">
          Preparing Your Quiz
        </h2>
        <p className="text-gray-500 mt-2">{message}</p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
          <Icon icon="mdi:loading" className="animate-spin" />
          <span>Getting questions ready for you...</span>
        </div>
      </div>
    </div>
  );
}
