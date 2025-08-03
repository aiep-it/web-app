'use client';

import React, { Key } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableProps,
  Spinner,
} from '@heroui/react';

export interface Column<T> {
  name: string;
  uid: keyof T | string;
  sortable?: boolean;
}

interface CTableProps<T> extends Omit<TableProps, 'children'> {
  columns: Column<T>[];
  data: T[];
  renderCell?: (item: T, columnKey: keyof T | string) => React.ReactNode;
  isLoading?: boolean;
  loadingContent?: string;
  isFakeKey?: boolean; // This prop is not used in the component, but included for compatibility
}
type DataWithIndex<T> = T & { _index?: number };
export const CTable = <T extends Record<string, any>>({
  columns,
  data,
  renderCell,
  isLoading = false,
  loadingContent = 'Loading...',
  isFakeKey = false, // This prop is not used in the component, but included for compatibility
  ...rest
}: CTableProps<T>) => {
  const dataWithIndex: DataWithIndex<T>[] = isFakeKey
    ? data.map((item, index) => ({
        ...item,
        _index: index,
      }))
    : data;
  return (
    <Table
      {...rest}
      isHeaderSticky
      aria-label="Vocabulary table"
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[100%]',
      }}
      selectionBehavior="toggle"
      selectionMode="multiple"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid as string}
            align="start"
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent="No data found"
        items={dataWithIndex}
        isLoading={isLoading}
        loadingContent={<Spinner variant="wave" label={loadingContent} />}
      >
        {(item) => (
          <TableRow key={item?.id ?? item._index}>
            {(columnKey: Key) => (
              <TableCell>
                {renderCell
                  ? renderCell(item, columnKey as keyof T)
                  : (item as any)[columnKey as keyof T]}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CTable;
