'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDisclosure, Button } from '@heroui/react';
import { toast } from 'react-hot-toast';

import { getAllClasses, deleteClass } from '@/services/class';
import { ClassResponse } from '@/services/types/class';
import { useRouter } from 'next/navigation';

import ClassFilters from '@/app/admin/classmanage/components/ClassFilters';
import ClassCard from '@/app/admin/classmanage/components/ClassCard';
import DeleteConfirmationModal from '@/app/admin/classmanage/components/DeleteConfirmationModal';
import LoadingSpinner from '@/components/Class/LoadingSpinner';
import { getAllTeachers } from '@/services/user';

import type { Teacher } from '@/services/types/user';

export default function ClassManagement() {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [classToDelete, setClassToDelete] = useState<ClassResponse | null>(
    null,
  );

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClassResponse | null>(null); // hoặc generic type nếu dùng chung

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: { teacherId?: string; search?: string } = {};
      if (selectedTeacher) {
        queryParams.teacherId = selectedTeacher;
      }
      if (search) {
        queryParams.search = search;
      }
      const data = await getAllClasses(queryParams);
      setClasses(data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      setError('Failed to load classes. Please try again.');
      toast.error('Failed to load classes.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedTeacher]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const data = await getAllTeachers();
      setTeachers(data); // Assume data is Teacher[]
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Handlers for ClassCard actions

  const handleViewDetails = (classId: string) => {
    router.push(`/admin/classmanage/${classId}`);
  };

  const handleEditClass = (classId: string) => {
    toast(`Edit class ID: ${classId}`);
  };

  const handleManageTeachers = (classId: string) => {
    toast(`Manage teachers for class ID: ${classId}`);
  };

  const handleManageStudents = (classId: string) => {
    toast(`Manage students for class ID: ${classId}`);
  };
  const handleDeleteClass = (classItem: ClassResponse) => {
    setItemToDelete(classItem);
    onOpen();
  };

  const confirmDeleteClass = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const success = await deleteClass(itemToDelete.id);
      if (success) {
        toast.success(`Class "${itemToDelete.name}" deleted successfully!`);
        setClasses((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        onClose();
      } else {
        toast.error(`Failed to delete class "${itemToDelete.name}".`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting class.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNewClass = () => {
    router.push('/admin/classmanage/create');
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold">Class Management</h1>

      <ClassFilters
        search={search}
        setSearch={setSearch}
        selectedTeacher={selectedTeacher}
        setSelectedTeacher={setSelectedTeacher}
        teachers={teachers}
        onAddNewClass={handleAddNewClass}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-danger-500 p-4 border border-danger-200 rounded-lg">
          <p>{error}</p>
          <Button className="mt-2" color="primary" onPress={fetchClasses}>
            Retry
          </Button>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center text-default-500 p-4 border border-default-200 rounded-lg">
          <p>No classes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((class_) => (
            <ClassCard
              key={class_.id}
              class_={class_}
              onViewDetails={handleViewDetails}
              onEditClass={handleEditClass}
              onManageTeachers={handleManageTeachers}
              onManageStudents={handleManageStudents}
              onDeleteClass={handleDeleteClass}
            />
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm Deletion"
        targetName={`class "${itemToDelete?.name}"`}
        description="This will permanently remove the class and all its related data."
        onConfirmDelete={confirmDeleteClass}
        isDeleting={isDeleting}
      />
    </div>
  );
}
