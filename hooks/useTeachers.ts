import { useEffect, useState } from 'react';
import { getAllTeachers } from '@/services/user';
import toast from 'react-hot-toast';

export const useTeachers = () => {
  const [allTeachers, setAllTeachers] = useState<{ id: string; fullName: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const teachers = await getAllTeachers(); 
    
        const simplified = (teachers || []).map((t: any) => ({
          id: String(t.id),
          fullName: t.fullName ?? '(Chưa có tên)',
        }));
        setAllTeachers(simplified);
      } catch {
        toast.error('Không thể tải giáo viên');
      }
    })();
  }, []);

  return { allTeachers };
};
