import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { ExerciseReportItem } from '@/services/types/report';


interface ExerciseTableProps {
  exerciseItems: ExerciseReportItem[];
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({ exerciseItems }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Exercise Report</h2>
      <Table aria-label="Exercise Report" removeWrapper>
        <TableHeader>
          <TableColumn>EXERCISE</TableColumn>
          <TableColumn>ATTEMPTED DATE</TableColumn>
          <TableColumn>SCORE</TableColumn>
        </TableHeader>
        <TableBody>
          {exerciseItems.map((exercise) => (
            <TableRow key={exercise.exerciseId}>
              <TableCell>{exercise.content}</TableCell>
              <TableCell>{new Date(exercise.attemptedAt).toLocaleDateString()}</TableCell>
              <TableCell>{exercise.score}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExerciseTable;