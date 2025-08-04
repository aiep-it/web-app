'use client';
import { Icon } from '@iconify/react';
import React from 'react';

type Props = {
  data: {
    fullName: string | null;
    username: string | null;
    parentPhone: string | null;
    address: string | null;
  }[];
};

export default function ExportToCSV({ data }: Props) {
  const handleExport = () => {
    const csv = [
      ['Họ tên', 'Username', 'SĐT phụ huynh', 'Địa chỉ'],
      ...data.map(row => [
        row.username ?? '',
        row.fullName ?? '',       
        row.parentPhone ?? '',
        row.address ?? '',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="p-2 rounded-full hover:bg-blue-100 transition-colors"
      title="Export CSV"
    >
      <Icon icon="lucide:file-text" className="text-blue-600 w-5 h-5" />
    </button>
  );
}
