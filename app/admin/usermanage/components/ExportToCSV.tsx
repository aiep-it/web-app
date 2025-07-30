'use client';
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
        row.fullName ?? '',
        row.username ?? '',
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
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
    >
      Export CSV
    </button>
  );
}
