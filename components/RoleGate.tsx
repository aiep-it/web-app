
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import useSWR from 'swr';
// import axiosInstance from '@/lib/axios';
// import { ENDPOINTS } from '@/constant/api';

// type RoleGateProps = {
//   allowedRoles: string[];
//   children: React.ReactNode;
// };

// // Fetcher function dùng cho SWR
// const fetchRole = async () => {
//   const res = await axiosInstance.get(ENDPOINTS.AUTHEN.GET_USER_ROLE); // '/users/me'
//   return res.data.role as string;
// };

// export default function RoleGate({ allowedRoles, children }: RoleGateProps) {
//   const router = useRouter();

//   const {
//     data: role,
//     error,
//     isLoading,
//   } = useSWR(ENDPOINTS.AUTHEN.GET_USER_ROLE, fetchRole);

//   useEffect(() => {
//     if (role && !allowedRoles.includes(role)) {
//       router.replace('/');
//     }
//   }, [role]);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) {
//     console.error('Error fetching role:', error);
//     router.replace('/404'); 
//     return null;
//   }

//   return <>{children}</>;
// }
// components/RoleGate.tsx
'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/constant/api';

type RoleGateProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const router = useRouter();

  const { data, error, isLoading } = useSWR(ENDPOINTS.AUTHEN.GET_USER_ROLE, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (error || (data && !allowedRoles.includes(data.role))) {
      router.replace('/');
    }
  }, [data, error]);

  if (isLoading || !data) return <div>Loading...</div>;

  return <>{children}</>;
}
