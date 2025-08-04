import { useEffect, useState } from 'react';
import { getAllTeachers } from '@/services/user';
import toast from 'react-hot-toast';
import { Teacher } from '@/services/types/user';

export const useTeachers = () => {
  const [allTeachers, setAllTeachers] = useState<{ id: string; fullName: string }[]>([]);

  // Ensure getAllTeachers returns the correct type
  const fetchTeachers = async () => {
    try {
      const teachers = await getAllTeachers();
      const formattedTeachers = teachers.map((teacher: Teacher) => ({
        id: teacher.id,
        fullName: teacher.fullName || '', // Provide a default value for fullName
      }));
      setAllTeachers(formattedTeachers);
    } catch {
      toast.error("Error fetching teachers. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    getAllTeachers()
      .then((teachers: Teacher[]) => {
        const formattedTeachers = teachers.map((teacher: Teacher) => ({
          id: teacher.id,
          fullName: teacher.fullName || '', // Provide a default value for fullName
        }));
        setAllTeachers(formattedTeachers);
      })
      .catch(() => toast.error('Không thể tải giáo viên'));
  }, []);

  return { allTeachers };
};
