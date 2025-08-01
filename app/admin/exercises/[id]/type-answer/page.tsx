'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function TypeAnswerExercisePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={() => router.back()}
              >
                <Icon icon="mdi:arrow-left" className="text-xl" />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Type Answer Exercises</h1>
                <p className="text-sm text-gray-500">Topic ID: {topicId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Icon icon="mdi:format-text" className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Type Answer Exercises
          </h2>
          <p className="text-gray-600 mb-6">
            This feature is coming soon. Users will be able to create fill-in-the-blank exercises.
          </p>
          <Button
            color="primary"
            variant="light"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
