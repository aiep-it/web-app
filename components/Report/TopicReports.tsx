import React from 'react';
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";

interface Topic {
  topicId: string;
  topicName: string;
  vocabProgress: {
    total: number;
    learned: number;
  };
  exerciseResults: {
    totalExercises: number;
    avgScore: number;
  };
}

interface TopicReportsProps {
  topics: Topic[];
}

const TopicReports: React.FC<TopicReportsProps> = ({ topics }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Topic Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Card key={topic.topicId}>
            <CardHeader>
              <h3 className="text-lg font-semibold">{topic.topicName}</h3>
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <p className="text-sm text-foreground-500 mb-1">Vocab Progress</p>
                <Progress
                  value={(topic.vocabProgress.learned / topic.vocabProgress.total) * 100}
                  className="max-w-md"
                  color="success"
                />
                <p className="text-sm mt-1">
                  {topic.vocabProgress.learned} / {topic.vocabProgress.total} words learned
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground-500 mb-1">Exercise Score</p>
                <Progress
                  value={topic.exerciseResults.avgScore}
                  className="max-w-md"
                  color="primary"
                />
                <p className="text-sm mt-1">
                  Average Score: {topic.exerciseResults.avgScore.toFixed(2)}%
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopicReports;