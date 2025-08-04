'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Input, Textarea, Select, SelectItem, Button,
  Card, CardHeader, Spinner, CardBody, useDisclosure,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@heroui/react';
import toast from 'react-hot-toast';
import { FaEdit, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

import {
  getClassById, updateClass, removeTeacherFromClass,
  addTeacherToClass, removeRoadmapFromClass,
  addStudentsToClass, addRoadmapToClass,
  removeStudentFromClass
} from '@/services/class';
import { getAllTeachers } from '@/services/user';
import { getRoadmap } from '@/services/roadmap';
import { getAllStudents } from '@/services/student';

import { ClassResponse, ClassLevel } from '@/services/types/class';
import { Student } from '@/services/types/student';
import StudentTable from '@/app/admin/usermanage/components/StudentTable';
import DeleteConfirmationModal from '@/app/admin/classmanage/components/DeleteConfirmationModal';

export default function ClassDetailPage() {
  const { id } = useParams();
  const classId = id as string;

  const [classData, setClassData] = useState<ClassResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    level: 'STARTERS',
  });

  const [allTeachers, setAllTeachers] = useState<{ id: string; fullName: string }[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [allRoadmaps, setAllRoadmaps] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isAddStudentOpen,
    onOpen: openAddStudentModal,
    onClose: closeAddStudentModal,
  } = useDisclosure();

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'teacher' | 'roadmap';
    id: string;
    name: string;
  } | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchClass();
    fetchAllTeachers();
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      fetchAvailableRoadmaps();
    }
  }, [isEditing]);

  const fetchClass = async () => {
    setLoading(true);
    const data = await getClassById(classId);
    if (data) {
      setClassData(data);
      setFormData({
        name: data.name,
        code: data.code,
        description: data.description || '',
        level: data.level,
      });
    }
    setLoading(false);
  };

  const fetchAllTeachers = async () => {
    const data = await getAllTeachers();
    setAllTeachers(data);
  };

  const fetchAvailableRoadmaps = async () => {
    const all = await getRoadmap();
    const existingIds = classData?.roadmaps.map((r) => r.id) || [];
    const available = all.filter((r: any) => !existingIds.includes(r.id));
    setAllRoadmaps(available);
  };

  const fetchAvailableStudents = async () => {
    const all = await getAllStudents();
    const existingIds = classData?.students?.map((s) => s.id) || [];
    const available = all.filter((s) => !existingIds.includes(s.id));
    setAvailableStudents(available);
    setSelectedStudentIds([]);
  };

  const handleOpenAddStudent = async () => {
    await fetchAvailableStudents();
    openAddStudentModal();
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) => [...prev, id]);
  };

  const handleDeselectStudent = (id: string) => {
    setSelectedStudentIds((prev) => prev.filter((s) => s !== id));
  };

  const handleConfirmAddStudents = async () => {
    if (selectedStudentIds.length === 0) {
      toast.error('Vui lòng chọn học sinh');
      return;
    }
    const success = await addStudentsToClass(classId, { studentIds: selectedStudentIds });
    if (success) {
      toast.success('Đã thêm học sinh vào lớp');
      await fetchClass();
      closeAddStudentModal();
    } else {
      toast.error('Không thể thêm học sinh');
    }
  };

  const handleAddTeacher = async () => {
    if (!selectedTeacherId) {
      toast.error('Chọn giáo viên');
      return;
    }
    const success = await addTeacherToClass(classId, { teacherId: selectedTeacherId });
    if (success) {
      toast.success('Đã thêm giáo viên');
      await fetchClass();
      setSelectedTeacherId(null);
    } else {
      toast.error('Không thể thêm giáo viên');
    }
  };

  const handleAddRoadmap = async () => {
    if (!selectedRoadmapId) {
      toast.error('Chọn lộ trình');
      return;
    }
    const success = await addRoadmapToClass(classId, selectedRoadmapId);
    if (success) {
      toast.success('Đã thêm roadmap');
      await fetchClass();
      setSelectedRoadmapId(null);
      await fetchAvailableRoadmaps();
    } else {
      toast.error('Thêm roadmap thất bại');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    let success = false;

    if (deleteTarget.type === 'teacher') {
      success = await removeTeacherFromClass(classId, { teacherId: deleteTarget.id });
    } else {
      success = await removeRoadmapFromClass(classId, deleteTarget.id);
    }

    if (success) {
      toast.success(`Đã xoá ${deleteTarget.name}`);
      await fetchClass();
      closeDeleteModal();
    } else {
      toast.error('Xoá thất bại');
    }

    setIsDeleting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const success = await updateClass(classId, {
      ...formData,
      level: formData.level as ClassLevel,
    });

    if (success) {
      toast.success('Cập nhật thành công');
      await fetchClass();
      setIsEditing(false);
    } else {
      toast.error('Cập nhật thất bại');
    }
  };

  const handleCancelEdit = () => {
    if (classData) {
      setFormData({
        name: classData.name,
        code: classData.code,
        description: classData.description || '',
        level: classData.level,
      });
    }
    setIsEditing(false);
  };

  if (loading || !classData)
    return <div className="flex justify-center py-10"><Spinner size="lg" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-full">
   

      {/* Thông tin lớp */}
      <Card>
        <CardHeader className="flex justify-between items-center bg-gray-100">
          <h2 className="text-xl font-semibold">Thông tin chung</h2>
          {!isEditing ? (
            <Button color="primary" variant="flat" onPress={() => setIsEditing(true)} startContent={<FaEdit />}>Chỉnh sửa</Button>
          ) : (
            <div className="flex gap-2">
              <Button color="primary" variant="flat" onPress={handleUpdate} startContent={<FaCheck />}>Lưu</Button>
              <Button color="danger" variant="flat" onPress={handleCancelEdit} startContent={<FaTimes />}>Hủy</Button>
            </div>
          )}
        </CardHeader>
        <CardBody className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Chi tiết lớp */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin chi tiết</h3>
            {isEditing ? (
              <div className="space-y-4">
                <Input label="Tên lớp" name="name" value={formData.name} onChange={handleInputChange} />
                <Input label="Mã lớp" name="code" value={formData.code} onChange={handleInputChange} />
                <Textarea label="Mô tả" name="description" value={formData.description} onChange={handleInputChange} />
                <Select label="Trình độ" selectedKeys={[formData.level]} onSelectionChange={(keys) => setFormData((prev) => ({ ...prev, level: Array.from(keys)[0] as string }))}>
                  <SelectItem key="STARTERS">Starters</SelectItem>
                  <SelectItem key="MOVERS">Movers</SelectItem>
                  <SelectItem key="FLYERS">Flyers</SelectItem>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <div><strong>Tên lớp:</strong> {classData.name}</div>
                <div><strong>Mã lớp:</strong> {classData.code}</div>
                <div><strong>Mô tả:</strong> {classData.description || 'Chưa có mô tả'}</div>
                <div><strong>Trình độ:</strong> {classData.level}</div>
              </div>
            )}
          </div>

          {/* Giáo viên */}
          <div>
            <h3 className="font-medium mb-2">Giáo viên</h3>
            {classData.teachers.map(t => (
              <div key={t.id} className="flex justify-between items-center py-1">
                <span>{t.fullName}</span>
                {isEditing && (
                  <Button color="danger" size="sm" isIconOnly onPress={() => {
                    setDeleteTarget({ type: 'teacher', id: t.id, name: t.fullName });
                    openDeleteModal();
                  }}><FaTrash /></Button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex items-center gap-2 mt-4">
                <Select label="Thêm giáo viên" selectedKeys={selectedTeacherId ? [selectedTeacherId] : []} onSelectionChange={(keys) => setSelectedTeacherId(Array.from(keys)[0] as string)} className="w-full" size="sm">
                  {allTeachers.filter(t => !classData.teachers.some(ct => ct.id === t.id)).map(t => (
                    <SelectItem key={t.id}>{t.fullName}</SelectItem>
                  ))}
                </Select>
                <Button onPress={handleAddTeacher} color="primary" isIconOnly size="sm">+</Button>
              </div>
            )}
          </div>

          {/* Lộ trình học */}
          <div>
            <h3 className="font-medium mb-2">Lộ trình học</h3>
            {classData.roadmaps.map(r => (
              <div key={r.id} className="flex justify-between items-center py-1">
                <span>{r.name}</span>
                {isEditing && (
                  <Button color="danger" size="sm" isIconOnly onPress={() => {
                    setDeleteTarget({ type: 'roadmap', id: r.id, name: r.name });
                    openDeleteModal();
                  }}><FaTrash /></Button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex items-center gap-2 mt-4">
                <Select
                  label="Chọn roadmap"
                  placeholder="Chọn roadmap"
                  selectedKeys={selectedRoadmapId ? [selectedRoadmapId] : []}
                  onSelectionChange={(keys) => setSelectedRoadmapId(Array.from(keys)[0] as string)}
                  className="w-full"
                  size="sm"
                >
                  {allRoadmaps.map((r) => (
                    <SelectItem key={r.id}>{r.name}</SelectItem>
                  ))}
                </Select>
                <Button onPress={handleAddRoadmap} color="primary" isIconOnly size="sm" isDisabled={!selectedRoadmapId}>+</Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Danh sách học sinh */}
      <Card>
        <CardHeader className="bg-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Học sinh {classData.name}</h2>
          <Button color="primary" onPress={handleOpenAddStudent}>Thêm học sinh</Button>
        </CardHeader>
        <CardBody className="p-4">
          <StudentTable
            students={classData.students || []}
            mode="class"
            onRemoveFromClass={async (studentId) => {
              await removeStudentFromClass(classId, studentId); 
              fetchClass(); 
            }}
          />


        </CardBody>
      </Card>

      {/* Modal thêm học sinh */}
      <Modal isOpen={isAddStudentOpen} onClose={closeAddStudentModal} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Thêm học sinh vào lớp</ModalHeader>
              <ModalBody>
                <StudentTable
                  students={availableStudents}
                  mode="select"
                  selectedStudentIds={selectedStudentIds}
                  onSelectStudent={handleSelectStudent}
                  onDeselectStudent={handleDeselectStudent}
                  showExport={false}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Hủy</Button>
                <Button color="primary" onClick={handleConfirmAddStudents}>Thêm</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal xoá giáo viên/roadmap */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={`Xoá ${deleteTarget?.type === 'teacher' ? 'giáo viên' : 'lộ trình'}`}
        targetName={deleteTarget?.name || ''}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
