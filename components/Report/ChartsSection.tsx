import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { ExerciseReportItem, ReportData } from '@/services/types/report';

interface ChartsSectionProps {
  // data: {
  //   vocabProgress: {
  //     total: number;
  //     learned: number;
  //     items: Array<{ isLearned: boolean }>;
  //   };
  //   exerciseResults: {
  //     items: Array<{ attemptedAt: string; score: number }>;
  //   };
  // };
  data: ReportData;
  barChartData?: ExerciseReportItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartsSection: React.FC<ChartsSectionProps> = ({
  data,
  barChartData = [],
}) => {
  const notLearVocabs =
    data.overview.totalVocabLearned && data.overview.totalVocabs
      ? data.overview.totalVocabs - data.overview.totalVocabLearned
      : 0;
  const pieChartData = [
    { name: 'Learned', value: data.overview.totalVocabLearned },
    {
      name: 'Not Learned',
      value: notLearVocabs,
    },
  ];

  const totalExercisesNotLeard =
    data.overview.totalExercises && data.overview.totalExercisesCompleted
      ? data.overview.totalExercises - data.overview.totalExercisesCompleted
      : 0;
  const radialBarData = [
    {
      name: 'Correct',
      value: data.overview.totalExercisesCorrect || 0,
      fill: COLORS[1],
    },
    {
      name: 'Submitted',
      value: data.overview.totalExercisesCompleted || 0,
      fill: COLORS[2],
    },
    {
      name: 'Missing',
      value: totalExercisesNotLeard,
      fill: COLORS[3],
    },
    {
      name: 'Total',
      value: data.overview.totalExercises || 0,
      fill: COLORS[0],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Vocab Progress</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Exercise Scores</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold">Excercise Submitted</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={20}
              data={radialBarData}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                dataKey="value"
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChartsSection;
