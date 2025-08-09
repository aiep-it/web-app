import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CourseOverviewReport } from '@/services/types/report';
import { calculePercentage } from '@/utils';

interface OverviewProps {
  data: CourseOverviewReport;
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  console.log('data', data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardBody className="flex items-center">
          <Icon
            icon="lucide:book-open"
            className="text-primary text-3xl mr-4"
          />
          <p className="text-sm text-foreground-500">Vocabs Learning</p>
          <p className="text-2xl font-bold">
            {data.totalVocabLearned} / {data.totalVocabs}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="flex items-center">
          <Icon
            icon="lucide:check-circle"
            className="text-warning text-3xl mr-4"
          />
          <div className="text-center">
            <p className="text-sm text-foreground-500">Exercises</p>
            <p className="text-2xl font-bold">
              {data.totalExercisesCompleted} / {data.totalExercises}
            </p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="flex items-center">
          <Icon
            icon="lucide:notebook-text"
            className="text-secondary text-3xl mr-4"
          />
          <div>
            <p className="text-sm text-foreground-500">Topics</p>
            <p className="text-2xl font-bold">
              {data.totalTopicEnrolled} / {data.totalTopics}
            </p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="flex items-center">
          <Icon
            icon="lucide:trending-up"
            className="text-primary text-3xl mr-4"
          />
          <div className="text-center">
            <p className="text-sm text-foreground-500">Average Correct Test</p>
            <p className="text-2xl font-bold">
              {calculePercentage(
                data?.totalExercisesCorrect ? data?.totalExercisesCorrect : 0,
                data?.totalExercises ? data?.totalExercises : 0,
              )}
              %
            </p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="flex items-center">
          <Icon
            icon="lucide:calendar"
            className="text-secondary text-3xl mr-4"
          />
          <div className="text-center">
            <p className="text-sm text-foreground-500">Last Attempt</p>
            <p className="text-lg font-bold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Overview;
