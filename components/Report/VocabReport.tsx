import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";

interface VocabItem {
  vocabId: string;
  word: string;
  isLearned: boolean;
}

interface Topic {
  topicId: string;
  topicName: string;
  vocabProgress: {
    items: VocabItem[];
  };
}

interface VocabReportProps {
  topics: Topic[];
}

const VocabReport: React.FC<VocabReportProps> = ({ topics }) => {
  const allVocabItems = topics.flatMap(topic => 
    topic.vocabProgress.items.map(item => ({
      ...item,
      topicName: topic.topicName
    }))
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vocab Report</h2>
      <Table aria-label="Vocab Report" removeWrapper>
        <TableHeader>
          <TableColumn>WORD</TableColumn>
          <TableColumn>TOPIC</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {allVocabItems.map((item) => (
            <TableRow key={item.vocabId}>
              <TableCell>{item.word}</TableCell>
              <TableCell>{item.topicName}</TableCell>
              <TableCell>
                <Chip
                  color={item.isLearned ? "success" : "warning"}
                  variant="flat"
                >
                  {item.isLearned ? "Learned" : "Not Learned"}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VocabReport;