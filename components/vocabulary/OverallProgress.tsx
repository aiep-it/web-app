'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { getCourseOverview } from '@/services/report';
import { CourseOverviewReport, ReportPage } from '@/services/types/report';
import toast from 'react-hot-toast';
import { Progress, Tooltip } from '@heroui/react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface OverallProgressProps {
  page?: ReportPage;
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const calculePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

export const OverallProgress: React.FC<OverallProgressProps> = ({
  page = ReportPage.COURSER,
}) => {
  // Get data from Redux store
  const vocabState = useSelector((state: RootState) => state.vocab);
  const topicState = useSelector((state: RootState) => state.topic);

  const [pieChartData, setPieChartData] = useState<
    { name: string; value: number }[]
  >([
    {
      name: 'Learned',
      value: 0,
    },
    {
      name: 'Not Learned',
      value: 0,
    },
  ]);

  const [overViewReport, setOverViewReport] =
    React.useState<CourseOverviewReport | null>(null);

  const getUserReport = async () => {
    try {
      const response = await getCourseOverview(page);
      if (response) {
        setOverViewReport(response);
        setPieChartData([
          {
            name: 'Learned',
            value: response?.totalExercisesCompleted || 0,
          },
          {
            name: 'Not Learned',
            value:
              response.totalExercisesCompleted && response.totalExercises
                ? response.totalExercisesCompleted - response.totalExercises
                : 0,
          },
        ]);
      } else {
        toast.error('Failed to fetch user report. Please try again later.');
        setOverViewReport({
          totalTopics: 0,
          totalTopicEnrolled: 0,
          totalVocabLearned: 0,
          totalVocabs: 0,
          totalExercisesCompleted: 0,
          totalExercises: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user report:', error);
      return null;
    }
  };

  // Calculate progress from real data
  const progress = useMemo(() => {
    const totalWords = overViewReport?.totalVocabs || 0;
    const knownWords = overViewReport?.totalVocabLearned || 0;
    const percentage = calculePercentage(knownWords, totalWords);

    return {
      totalWords,
      knownWords,
      percentage,
    };
  }, [overViewReport]);

  // Calculate topics from all roadmaps
  const allTopics = useMemo(() => {
    const topicsArray = Object.values(topicState.topicsByRoadmap).flat();
    const activeTopics = topicsArray.filter(
      (topic) => topic.status === 'SETTUPED',
    );

    return {
      total: topicsArray.length,
      active: activeTopics.length,
    };
  }, [topicState.topicsByRoadmap]);

  useEffect(() => {
    // Fetch user report when component mounts
    if (!overViewReport) {
      getUserReport();
    }
  }, []);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Learning Progress
            </h3>
            <p className="text-sm text-gray-600">
              Track your vocabulary development
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {progress.percentage}%
            </div>
            <div className="text-xs text-gray-500 font-medium">Overall</div>
          </div>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Progress Circle - Compact */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-20 h-20">
              <svg
                className="w-20 h-20 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="#f3f4f6"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress.percentage / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs font-bold text-primary">
                  {progress.percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Stats - Horizontal Layout */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="text-center bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">
                {progress.knownWords}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                Words Learned
              </div>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-2xl font-bold text-green-700">
                {progress.totalWords}
              </div>
              <div className="text-xs text-green-600 font-medium">
                Total Words
              </div>
            </div>
          </div>

          {/* Course Progress */}
          {overViewReport && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Topics
                </span>
                <span
                  className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${
                    overViewReport?.totalTopicEnrolled ===
                    overViewReport.totalTopics
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }
                `}
                >
                  {overViewReport?.totalTopicEnrolled}/
                  {overViewReport.totalTopics}
                </span>
              </div>

              {/* Progress bar for topics */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(overViewReport.totalTopics || 0) > 0 ? calculePercentage(overViewReport.totalTopicEnrolled || 0, overViewReport.totalTopics || 0) : 0}%`,
                  }}
                ></div>
              </div>

              {/* Motivational Message - Compact */}
              <div className="text-center">
                <div className="text-xs text-gray-600">
                  {progress.percentage === 100
                    ? '🎉 All vocabulary mastered!'
                    : progress.percentage >= 75
                      ? '🌟 Almost there!'
                      : progress.percentage >= 50
                        ? '💪 Keep it up!'
                        : progress.percentage >= 25
                          ? '📚 Nice start!'
                          : '🚀 Begin journey!'}
                </div>
              </div>
            </div>
          )}
          {/* Course Progress */}
          {overViewReport && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-foreground-500 mb-1">
                    Exercise Progress
                  </p>
                  <Progress
                    value={calculePercentage(
                      overViewReport.totalExercisesCompleted || 0,
                      overViewReport.totalExercises || 0,
                    )}
                    className="max-w-md mt-2"
                    color="success"
                  />
                  <p className="text-sm mt-1">
                    {overViewReport.totalExercisesCompleted} /{' '}
                    {overViewReport.totalExercises} Exercises completed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
