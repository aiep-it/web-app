'use client';
import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, useDisclosure, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Student, StudentPayload } from '@/services/types/student';
import { getAllStudents, deleteStudent, updateStudent } from '@/services/student';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentSchema } from '@/app/admin/usermanage/schema/studentSchema';
import ExportToCSV from './ExportToCSV';

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // 🟡 Modal Edit
  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentPayload>({
    resolver: yupResolver(studentSchema),
  });

  const [loading, setLoading] = useState(false);

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

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    reset({
      fullName: student.fullName,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
    });
    openEdit();
  };

  const onSubmitEdit = async (data: StudentPayload) => {
    if (!editingStudent) return;
    setLoading(true);
    try {
      const result = await updateStudent(editingStudent.id, data);
      if (result) {
        closeEdit();
        fetchData();
      }
    } catch (err) {
      console.error('❌ Lỗi cập nhật học sinh:', err);
    } finally {
      setLoading(false);
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
      <ExportToCSV data={students} />

      </div>

      <Table aria-label="Danh sách học sinh" classNames={{ wrapper: "max-h-[600px]" }}>
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
                  <Button size="sm" color="primary" variant="light" onPress={() => handleEdit(s)}>
                    <Icon icon="lucide:edit" className="text-lg" /> Sửa
                  </Button>
                  <Button size="sm" color="danger" variant="light" onPress={() => handleDelete(s)}>
                    <Icon icon="lucide:trash-2" className="text-lg" /> Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-1 mt-4">
        <Button isIconOnly size="sm" variant="light" onClick={() => handlePageChange(page - 1)} isDisabled={page === 1}>
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
        <Button isIconOnly size="sm" variant="light" onClick={() => handlePageChange(page + 1)} isDisabled={page === totalPages}>
          <Icon icon="lucide:chevron-right" />
        </Button>
      </div>

      {/* ✅ Modal Xóa */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Xác nhận xóa</ModalHeader>
              <ModalBody>Bạn có chắc muốn xóa học sinh <b>{studentToDelete?.fullName}</b>?</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Hủy</Button>
                <Button color="primary" onPress={confirmDelete}>Xác nhận</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ✅ Modal Chỉnh sửa */}
      <Modal isOpen={isEditOpen} onClose={closeEdit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Chỉnh sửa học sinh</ModalHeader>
              <ModalBody>
                <form className="space-y-4">
                  <Input
                    label="Họ tên học sinh"
                    {...register('fullName')}
                    labelPlacement="outside-top" 
                    isInvalid={!!errors.fullName}
                    errorMessage={errors.fullName?.message}
                  />
                  <Input
                    label="Tên phụ huynh"
                    {...register('parentName')}
                    labelPlacement="outside-top" 
                    isInvalid={!!errors.parentName}
                    errorMessage={errors.parentName?.message}
                  />
                  <Input
                    label="SĐT phụ huynh"
                    {...register('parentPhone')}
                    labelPlacement="outside-top" 
                    isInvalid={!!errors.parentPhone}
                    errorMessage={errors.parentPhone?.message}
                  />
                  <Input
                    label="Địa chỉ"
                    {...register('address')}
                    labelPlacement="outside-top" 
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Hủy</Button>
                <Button color="primary" onClick={handleSubmit(onSubmitEdit)} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Lưu'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
