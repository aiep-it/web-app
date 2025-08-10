    'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios'; // axiosInstance bạn đang dùng
import { ENDPOINTS } from '@/constant/api'; // Đường dẫn tới file chứa ENDPOINTS

export const useRoleRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await axios.get(ENDPOINTS.AUTHEN.GET_USER_ROLE || '/users/me');
        const role = res.data.role;

        switch (role) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'student':
            router.replace('/student');
            break;
          case 'teacher':
            router.replace('/teacher');
            break;
          case 'staff':
            router.replace('/staff');
            break;
          case 'parent':
            router.replace('/parent');
            break;
          default:
            router.replace('/');
        }
      } catch (err) {
        console.error('Redirect failed:', err);
        router.replace('/');
      }
    };

    checkRole();
  }, []);
};
