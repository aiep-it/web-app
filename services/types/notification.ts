export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string; // ISO string
}
