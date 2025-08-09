import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
} from '@heroui/react';
import { VocabReportItems } from '@/services/types/report';

interface VocabTableProps {
  vocabItems: VocabReportItems[];
}

const VocabTable: React.FC<VocabTableProps> = ({ vocabItems }) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(vocabItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return vocabItems.slice(start, end);
  }, [page, vocabItems]);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vocab Report</h2>
      <Table
        aria-label="Vocab Report"
        removeWrapper
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>WORD</TableColumn>

          <TableColumn>MEANING</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.vocabId}>
              <TableCell>{item.word}</TableCell>
              <TableCell>{item.meaning || ''}</TableCell>
              <TableCell>
                <Chip
                  color={item.isLearned ? 'success' : 'warning'}
                  variant="flat"
                >
                  {item.isLearned ? 'Learned' : 'Not Learned'}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VocabTable;
