'use client';

import ChartsSection from '@/components/Report/ChartsSection';
import ExerciseTable from '@/components/Report/ExerciseTable';
import Overview from '@/components/Report/Overview';
import VocabTable from '@/components/Report/VocabTable';
import { getSelfReport } from '@/services/report';
import {
  ExerciseReportItem,
  ReportData,
  VocabReportItems,
} from '@/services/types/report';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Sample data for a single topic
const sampleTopicData = {
  topicId: 'cmdoqwt660003kaecnx9cohu7',
  topicName: 'Hoạt động',
  vocabProgress: {
    total: 11,
    learned: 8,
    items: [
      {
        vocabId: 'cmdoraf490007kaecmpcoiazg',
        word: 'Play',
        isLearned: true,
        lastSeenAt: '2025-08-05T10:30:00.000Z',
      },
      {
        vocabId: 'cmdoraf5u0009kaecx27x7ijf',
        word: 'Read',
        isLearned: true,
        lastSeenAt: '2025-08-06T14:45:00.000Z',
      },
      {
        vocabId: 'cmdoraf5u0010kaecx27x7ijg',
        word: 'Write',
        isLearned: false,
        lastSeenAt: null,
      },
    ],
  },
  exerciseResults: {
    totalExercises: 14,
    avgScore: 85.7,
    lastAttemptAt: '2025-08-06T17:23:06.009Z',
    items: [
      {
        exerciseId: 'cmdx9uk570008kag8lebpuykh',
        attemptedAt: '2025-08-06T17:23:06.009Z',
        score: 90,
      },
      {
        exerciseId: 'cmdx9uk570009kag8lebpuyki',
        attemptedAt: '2025-08-05T15:30:00.000Z',
        score: 80,
      },
      {
        exerciseId: 'cmdx9uk570010kag8lebpuykj',
        attemptedAt: '2025-08-04T12:15:00.000Z',
        score: 87,
      },
    ],
  },
};

const MyReport = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [excercise, setExcercise] = useState<ExerciseReportItem[]>([]);
  const [vocabs, setVocabs] = useState<VocabReportItems[]>([]);
  const fetchSelfReport = async () => {
    const res = await getSelfReport();

    if (res) {
      console.log('res', res);
      setReportData({ ...res });
    } else {
      toast.error('Fail to fetch Report');
    }
  };

  useEffect(() => {
    fetchSelfReport();
  }, []);

  useEffect(() => {
    if (reportData) {
      const excercise = reportData.topics
        .flatMap((topic) =>
          (topic.exerciseResults?.items || []).map((item) => ({
            topicId: topic.topicId,
            topicName: topic.topicName,
            date: new Date(item.attemptedAt).toLocaleDateString(),
            attemptedAt: item.attemptedAt,
            exerciseId: item.exerciseId,
            score: item.score || 0, // in case score exists
            content: item.content || '',
          })),
        )
        .sort(
          (a, b) =>
            new Date(a.attemptedAt).getTime() -
            new Date(b.attemptedAt).getTime(),
        );
      setExcercise(excercise);

      const vocabs = reportData.topics.flatMap((topic) =>
        (topic.vocabProgress?.items || []).map((item) => item),
      );

      setVocabs(vocabs);
    }
  }, [reportData]);
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold text-foreground">
            My Report Progress
          </h1>
        </CardHeader>
        <CardBody>
          {reportData && <Overview data={reportData.overview} />}
          <Divider className="my-6" />
          {reportData && (
            <ChartsSection data={reportData} barChartData={excercise} />
          )}
          <Divider className="my-6" />
          <VocabTable vocabItems={vocabs} />
          <Divider className="my-6" />
          {excercise && <ExerciseTable exerciseItems={excercise} />}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyReport;
