'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDisclosure, Button } from '@heroui/react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { getAllClasses, deleteClass } from '@/services/class';
import { getAllTeachers } from '@/services/user';

import ClassFilters from '@/app/admin/classmanage/components/ClassFilters';
import ClassCard from '@/app/admin/classmanage/components/ClassCard';
import DeleteConfirmationModal from '@/app/admin/classmanage/components/DeleteConfirmationModal';
import LoadingSpinner from '@/components/Class/LoadingSpinner';

import type { ClassResponse } from '@/services/types/class';
import type { Teacher } from '@/services/types/user';

export default function ClassManagement() {
  // Data states
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  // Delete flow
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClassResponse | null>(null);

  const router = useRouter();

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: { teacherId?: string; search?: string } = {};
      if (selectedTeacher) queryParams.teacherId = selectedTeacher;
      if (search) queryParams.search = search;

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

  // Fetch teachers (once)
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTeachers();
        setTeachers(data || []);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
        toast.error('Failed to load teachers.');
      }
    })();
  }, []);

  // Trigger fetch when filters change
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Handlers for actions on each class card
  const handleViewDetails = useCallback((classId: string) => {
    router.push(`/admin/classmanage/${classId}`);
  }, [router]);

  const handleEditClass = useCallback((classId: string) => {
    toast(`Edit class ID: ${classId}`);
  }, []);

  const handleManageTeachers = useCallback((classId: string) => {
    toast(`Manage teachers for class ID: ${classId}`);
  }, []);

  const handleManageStudents = useCallback((classId: string) => {
    toast(`Manage students for class ID: ${classId}`);
  }, []);

  const handleAddNewClass = useCallback(() => {
    router.push('/admin/classmanage/create');
  }, [router]);

  const handleDeleteClass = useCallback((classItem: ClassResponse) => {
    setItemToDelete(classItem);
    onOpen();
  }, [onOpen]);

const confirmDeleteClass = useCallback(async () => {
  if (!itemToDelete || isDeleting) return;
  setIsDeleting(true);
  try {
    const ok = await deleteClass(itemToDelete.id);
    if (!ok) {
      toast.error(`Failed to delete class "${itemToDelete.name}".`);
      return;
    }

    setClasses(prev => prev.filter(c => c.id !== itemToDelete.id));
    toast.success(`Class "${itemToDelete.name}" deleted successfully!`);

 
    setIsDeleting(false);
    
    queueMicrotask(() => {
      onClose();
      setItemToDelete(null);
    });
  } catch (err: any) {
    console.error('Delete class error:', err);
    toast.error(err?.message || 'Error deleting class.');
    setIsDeleting(false);
  }
}, [itemToDelete, isDeleting, onClose]);


  return (
    <div className="p-6 space-y-6">
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
  onClose={onClose}  // giữ nguyên từ useDisclosure()
  title="Confirm Deletion"
  targetName={`class "${itemToDelete?.name ?? ''}"`}
  description="This will permanently remove the class and all its related data."
  onConfirmDelete={confirmDeleteClass}
  isDeleting={isDeleting}
  lockWhileDeleting
/>

    </div>
  );
}
