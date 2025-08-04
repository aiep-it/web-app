'use client';

import { useEffect, useState } from 'react';
import UserManageForm from '../usermanage/components/UserManageForm';
import StudentTable from '../usermanage/components/StudentTable';
import { Student } from '@/services/types/student';
import { getAllStudents, deleteStudent, updateStudent } from '@/services/student';

export default function StudentManagerPage() {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    const data = await getAllStudents();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteStudent(id);
    fetchStudents(); // refresh sau khi xoá
  };
  interface Props {
  refetchStudents?: () => void;
}

  const handleEdit = async (student: Student) => {
    // Không cần làm gì ở đây vì modal edit đã nằm bên trong `StudentTable`,
    // Nhưng bắt buộc phải truyền để modal biết hàm nào được gọi
    // Nếu muốn làm nâng cao, bạn có thể truyền hàm khác để log hoặc lưu lịch sử chỉnh sửa
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="lg:w-2/5 container mx-auto max-w-4xl">
          <UserManageForm   refetchStudents={fetchStudents} />
        </div>

        <div className="lg:w-3/5 w-full border p-6 rounded shadow-sm bg-white overflow-auto">
          <StudentTable
            students={students}
            mode="manage"
            onEditStudent={() => { }} 
            onDeleteStudent={handleDelete}
            refetchStudents={fetchStudents}
            showExport
          />

        </div>
      </div>
    </div>
  );
}
