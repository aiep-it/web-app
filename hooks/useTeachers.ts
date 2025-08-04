import { useEffect, useState } from 'react';
import { getAllTeachers } from '@/services/user';
import toast from 'react-hot-toast';

export const useTeachers = () => {
  const [allTeachers, setAllTeachers] = useState<{ id: string; fullName: string }[]>([]);

  useEffect(() => {
    getAllTeachers().then(setAllTeachers).catch(() => toast.error('Không thể tải giáo viên'));
  }, []);

  return { allTeachers };
};
