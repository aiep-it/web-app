'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Checkbox,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Student, StudentPayload } from '@/services/types/student';
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from '@/services/student';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentSchema } from '@/app/admin/usermanage/schema/studentSchema';
import ExportToCSV from './ExportToCSV';

// 🔶 Type definition
export type Mode = 'manage' | 'select' | 'class';

interface StudentTableProps {
  students: Student[];
  mode: Mode;
  selectedStudentIds?: string[];
  onSelectStudent?: (id: string) => void;
  onDeselectStudent?: (id: string) => void;
  onDeleteStudent?: (id: string) => void;
  onEditStudent?: (student: Student) => void;
  onRemoveFromClass?: (id: string) => void;
  showExport?: boolean;
  refetchStudents?: () => void;
}

export default function StudentTable({
  students,
  mode,
  selectedStudentIds = [],
  onSelectStudent,
  onDeselectStudent,
  onDeleteStudent,
  onEditStudent,
  onRemoveFromClass,
  showExport = mode === 'manage',
  refetchStudents,
}: StudentTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

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

  const filtered = students.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    onOpen();
  };

  const confirmDelete = async () => {
    if (studentToDelete && onDeleteStudent) {
      await onDeleteStudent(studentToDelete.id);
      refetchStudents?.();
      onClose();
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    reset({
      fullName: student.fullName,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
      parentEmail: student.parentEmail || '',
    });
    openEdit();
  };

  const onSubmitEdit = async (data: StudentPayload) => {
    if (!editingStudent || !onEditStudent) return;
    setLoading(true);
    try {
      await updateStudent(editingStudent.id, data);
      closeEdit();
      refetchStudents?.();
    } catch (err) {
      console.error('❌ Lỗi cập nhật học sinh:', err);
    } finally {
      setLoading(false);
    }
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
          startContent={
            <Icon icon="lucide:search" className="text-default-400" />
          }
          className="w-full max-w-xs"
        />
        {showExport && <ExportToCSV data={students} />}
      </div>

      <Table
        aria-label="Danh sách học sinh"
        classNames={{ wrapper: 'max-h-[600px]' }}
      >
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Họ và tên học sinh</TableColumn>
          <TableColumn>Phụ huynh</TableColumn>
          <TableColumn>SĐT</TableColumn>
          <TableColumn>Email Phụ huynh</TableColumn>
          {/* <TableColumn>Địa chỉ</TableColumn> */}
          <TableColumn>{mode === 'select' ? 'Chọn' : 'Thao tác'}</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Không có dữ liệu học sinh">
          {paginated.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.username}</TableCell>
              <TableCell>{s.fullName}</TableCell>
              <TableCell>{s.parentName}</TableCell>
              <TableCell>{s.parentPhone}</TableCell>
              <TableCell>{s.parentEmail}</TableCell>
              {/* <TableCell>{s.address}</TableCell> */}
              <TableCell>
                {mode === 'select' ? (
                  <Checkbox
                    isSelected={selectedStudentIds.includes(s.id)}
                    onValueChange={(checked) =>
                      checked
                        ? onSelectStudent?.(s.id)
                        : onDeselectStudent?.(s.id)
                    }
                  />
                ) : mode === 'class' ? (
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => onRemoveFromClass?.(s.id)}
                  >
                    <Icon icon="lucide:trash-2" className="text-lg" /> Xóa khỏi
                    lớp
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="light"
                      onPress={() => handleEdit(s)}
                    >
                      <Icon icon="lucide:edit" className="text-lg" /> Sửa
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(s)}
                    >
                      <Icon icon="lucide:trash-2" className="text-lg" /> Xóa
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
            variant={page === i + 1 ? 'solid' : 'light'}
            color={page === i + 1 ? 'primary' : 'default'}
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

      {/* Modal Xóa */}
      {mode === 'manage' && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Xác nhận xóa</ModalHeader>
                <ModalBody>
                  Bạn có chắc muốn xóa học sinh{' '}
                  <b>{studentToDelete?.fullName}</b>?
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
      )}

      {/* Modal Chỉnh sửa */}
      {mode === 'manage' && (
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
                      label="Email phụ huynh (Tài khoản đăng nhập)"
                      placeholder="Email phụ huynh"
                      labelPlacement="outside-top"
                      {...register('parentEmail')}
                      isInvalid={!!errors.parentEmail}
                      errorMessage={errors.parentEmail?.message}
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
                  <Button variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSubmit(onSubmitEdit)}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : 'Lưu'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
