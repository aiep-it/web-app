import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { TopicReport } from '@/services/types/report';


interface ExerciseReportProps {
  topics: TopicReport[];
}

const ExerciseReport: React.FC<ExerciseReportProps> = ({ topics }) => {
  const allExercises = topics.flatMap(topic => 
    topic.exerciseResults.items.map(item => ({
      ...item,
      topicName: topic.topicName,
      avgScore: topic.exerciseResults.avgScore
    }))
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Exercise Report</h2>
      <Table aria-label="Exercise Report" removeWrapper>
        <TableHeader>
          <TableColumn>TOPIC</TableColumn>
          <TableColumn>EXERCISE ID</TableColumn>
          <TableColumn>COMPLETION DATE</TableColumn>
          <TableColumn>SCORE</TableColumn>
        </TableHeader>
        <TableBody>
          {allExercises.map((exercise) => (
            <TableRow key={exercise.exerciseId}>
              <TableCell>{exercise.topicName}</TableCell>
              <TableCell>{exercise.exerciseId}</TableCell>
              <TableCell>{new Date(exercise.attemptedAt).toLocaleDateString()}</TableCell>
              <TableCell>{exercise.avgScore.toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExerciseReport;