'use client';
import { useState } from 'react';

export default function ExportToCSV() {
  const [data] = useState([
    { fullName: 'Nguyễn Văn A', phone: '0123456789', address: 'Hà Nội' },
    { fullName: 'Trần Thị B', phone: '0987654321', address: 'Đà Nẵng' },
  ]);

  const handleExport = () => {
    const csv = [
      ['Họ tên', 'SĐT', 'Địa chỉ'],
      ...data.map(row => [row.fullName, row.phone, row.address]),
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
    <div className="space-x-2">
      
      <button
        onClick={handleExport}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Export CSV
      </button>
    </div>
  );
}
