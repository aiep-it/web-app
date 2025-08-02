'use client';
import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, useDisclosure, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Student } from '@/services/types/student';
import { getAllStudents, deleteStudent } from '@/services/student';
import ExportToCSV from './ExportToCSV';

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const fetchData = async () => {
    const data = await getAllStudents();
    setStudents(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    onOpen();
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      const success = await deleteStudent(studentToDelete.id);
      if (success) {
        fetchData();
        onClose();
      }
    }
  };

  const filtered = students.filter((s) =>
    (s.fullName || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          className="w-full max-w-xs"
        />
        <ExportToCSV />
      </div>

      <Table
        aria-label="Danh sách học sinh"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
      >
        <TableHeader>
          <TableColumn>Họ tên</TableColumn>
          <TableColumn>Phụ huynh</TableColumn>
          <TableColumn>SĐT</TableColumn>
          <TableColumn>Địa chỉ</TableColumn>
          <TableColumn>Thao tác</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Không có dữ liệu học sinh">
          {paginated.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.fullName}</TableCell>
              <TableCell>{s.parentName}</TableCell>
              <TableCell>{s.parentPhone}</TableCell>
              <TableCell>{s.address}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" color="primary" variant="light">
                    <Icon icon="lucide:edit" className="text-lg" />
                    Sửa
                  </Button>
                  <Button size="sm" color="danger" variant="light" onPress={() => handleDelete(s)}>
                    <Icon icon="lucide:trash-2" className="text-lg" />
                    Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Pagination đẹp như mẫu */}
      <div className="flex justify-center items-center gap-1 mt-4">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => handlePageChange(page - 1)}
          isDisabled={page === 1}
        >
          <Icon icon="lucide:chevron-left" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            size="sm"
            variant={page === i + 1 ? "solid" : "light"}
            color={page === i + 1 ? "primary" : "default"}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => handlePageChange(page + 1)}
          isDisabled={page === totalPages}
        >
          <Icon icon="lucide:chevron-right" />
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Xác nhận xóa</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa học sinh {studentToDelete?.fullName}?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" onPress={confirmDelete}>
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
