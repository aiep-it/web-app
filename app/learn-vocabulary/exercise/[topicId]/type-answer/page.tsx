'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DoTypeAnswerContainer } from '@/components/DoTypeAnswer';

export default function TypeAnswerPage() {
  const params = useParams();
  const topicId = params.topicId as string;

  return <DoTypeAnswerContainer topicId={topicId} />;
}
