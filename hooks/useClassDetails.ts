import { useEffect, useState } from 'react';
import { getClassById, updateClass, removeTeacherFromClass, addTeacherToClass, removeRoadmapFromClass } from '@/services/class';
import { ClassResponse, ClassLevel } from '@/services/types/class';
import toast from 'react-hot-toast';

export const useClassDetails = (id: string) => {
  const [classData, setClassData] = useState<ClassResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClass = async () => {
    setLoading(true);
    const data = await getClassById(id);
    if (data) setClassData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchClass();
  }, [id]);

  const updateClassDetails = async (formData: Partial<ClassResponse>) => {
    const success = await updateClass(id, formData);
    if (success) {
      toast.success('Cập nhật thành công');
      setClassData(prev => (prev ? { ...prev, ...formData } : prev));
    } else toast.error('Cập nhật thất bại');
    return success;
  };

  const addTeacher = async (teacherId: string, teacherName: string) => {
    const success = await addTeacherToClass(id, { teacherId });
    if (success) {
      toast.success('Thêm giáo viên thành công');
      setClassData(prev => prev && ({ ...prev, teachers: [...(prev.teachers || []), { id: teacherId, fullName: teacherName }] }));
    } else toast.error('Thêm giáo viên thất bại');
  };

  const removeTeacher = async (teacherId: string) => {
    const success = await removeTeacherFromClass(id, { teacherId });
    if (success) {
      toast.success('Xóa giáo viên thành công');
      setClassData(prev => prev && ({ ...prev, teachers: prev.teachers.filter(t => t.id !== teacherId) }));
    } else toast.error('Xóa giáo viên thất bại');
  };

  const removeRoadmap = async (roadmapId: string) => {
    const success = await removeRoadmapFromClass(id, roadmapId);
    if (success) {
      toast.success('Xóa lộ trình thành công');
      setClassData(prev => prev && ({ ...prev, roadmaps: prev.roadmaps.filter(r => r.id !== roadmapId) }));
    } else toast.error('Xóa lộ trình thất bại');
  };

  return { classData, loading, updateClassDetails, addTeacher, removeTeacher, removeRoadmap };
};
