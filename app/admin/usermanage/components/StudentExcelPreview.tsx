'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function StudentExcelPreview() {
  const [students, setStudents] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setStudents(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">📑 Preview file Excel</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />
      {students.length > 0 && (
        <table className="w-full table-auto border mt-4">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(students[0]).map((key) => (
                <th key={key} className="px-3 py-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-3 py-1 border text-sm">{String(val)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}