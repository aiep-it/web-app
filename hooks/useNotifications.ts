// "use client";

// import useSWR from "swr";
// import { useAuth } from "@clerk/nextjs";
// import { useCallback, useMemo } from "react";

// export interface NotificationItem {
//   id: string;
//   title: string;
//   message: string;
//   link?: string | null;
//   read: boolean;
//   createdAt: string;
// }

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

// export function useNotifications() {
//   const { getToken, isSignedIn } = useAuth();

//   const fetcher = useCallback(async (url: string) => {
//     const token = await getToken(); // Clerk session token
//     const res = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       credentials: "include",
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   }, [getToken]);

//   const { data, error, isLoading, mutate } = useSWR<NotificationItem[]>(
//     isSignedIn ? `${API_BASE}/api/notifications` : null,
//     fetcher,
//     { refreshInterval: 0 } // bạn có thể set 15000 để poll mỗi 15s
//   );

//   const unreadCount = useMemo(
//     () => (data?.filter(n => !n.read).length ?? 0),
//     [data]
//   );

//   const markAsRead = useCallback(async (id: string) => {
//     const token = await getToken();
//     await fetch(`${API_BASE}/api/notifications/${id}/read`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       credentials: "include",
//     });
//     mutate();
//   }, [getToken, mutate]);

//   return {
//     notifications: data ?? [],
//     isLoading,
//     error,
//     unreadCount,
//     markAsRead,
//     refresh: mutate,
//   };
// }
