import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { NotificationItem } from "../types/notification";



export async function getMyNotifications(): Promise<NotificationItem[]> {
  try {
    return await axiosInstance
      .get(ENDPOINTS.NOTIFICATION.GET_MY)
      .then((response) => {
        if (response.status === 200) {
          return response.data as NotificationItem[];
        }
        return [];
      })
      .catch((e) => {
        // console.error("Error fetching notifications:", e);
        return [];
      });
  } catch (error) {
    // console.error("Error fetching notifications:", error);
    return [];
  }
}


export async function markNotificationRead(id: string): Promise<boolean> {
  try {
    return await axiosInstance
      .patch(ENDPOINTS.NOTIFICATION.MARK_READ(id))
      .then((response) => {
        // Backend trả 200 { ok: true }
        return response.status === 200;
      })
      .catch((e) => {
        // console.error("Error marking notification read:", e);
        return false;
      });
  } catch (error) {
    console.error("Error marking notification read:", error);
    return false;
  }
}

export function countUnread(items: NotificationItem[]): number {
  return items.filter((n) => !n.read).length;
}
