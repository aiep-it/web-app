"use client";

import { getMyNotifications, markNotificationRead } from "@/services/notification";
import { NotificationItem } from "@/services/types/notification";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import type { NotificationItem } from "@/types/notification";
// import { getMyNotifications, markNotificationRead } from "@/services/notification.api";

/**
 * Hook đơn giản dùng services + axiosInstance của bạn
 * - Không dùng SWR
 * - Có optional polling (tắt mặc định)
 */
export function useNotifications(options?: { pollMs?: number }) {
  const { pollMs = 0 } = options || {};
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyNotifications();
      setNotifications(data);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    if (pollMs > 0) {
      pollRef.current = setInterval(load, pollMs);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }
  }, [load, pollMs]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id: string) => {
    const ok = await markNotificationRead(id);
    if (ok) {
      // update optimistic
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
    return ok;
  }, []);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    refresh: load,
  };
}
