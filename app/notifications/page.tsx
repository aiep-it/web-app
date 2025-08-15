"use client";

import { useEffect, useMemo, useState } from "react";


import { Button, Card, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/services/types/notification";
import { getMyNotifications, markNotificationRead } from "@/services/notification";

function timeAgo(dateStr: string) {
  const d = new Date(dateStr).getTime();
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

export default function NotificationCenterPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null); // id đang xử lý

  const load = async () => {
    setLoading(true);
    const data = await getMyNotifications();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return items;
    return items.filter((n) =>
      [n.title, n.message].some((s) => s?.toLowerCase().includes(kw))
    );
  }, [q, items]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const onMarkOne = async (id: string) => {
    setBusy(id);
    const ok = await markNotificationRead(id);
    if (ok) {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
    setBusy(null);
  };

  const onMarkAll = async () => {
    const unread = items.filter((n) => !n.read);
    if (unread.length === 0) return;
    setBusy("ALL");
    for (const n of unread) {
      await markNotificationRead(n.id).catch(() => {});
    }
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setBusy(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Thông báo</h1>
          <span className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} chưa đọc` : "Tất cả đã đọc"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            size="sm"
            placeholder="Tìm theo tiêu đề/nội dung…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            startContent={<Icon icon="mdi:magnify" width={18} height={18} />}
            className="w-64"
          />
          <Button size="sm" variant="flat" onPress={load} isDisabled={loading}>
            Làm mới
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onPress={onMarkAll}
            isDisabled={busy === "ALL" || unreadCount === 0}
            isLoading={busy === "ALL"}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <Icon icon="mdi:bell-off-outline" width={36} height={36} className="mx-auto mb-3" />
          Chưa có thông báo.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`p-4 transition ${
                !n.read ? "border border-blue-200 bg-blue-50/30" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:bell-outline" width={18} height={18} />
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-gray-400">• {timeAgo(n.createdAt)}</div>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{n.message}</div>
                  {n.link && (
                    <button
                      onClick={() => router.push(n.link!)}
                      className="text-sm text-blue-600 underline mt-2"
                    >
                      Xem chi tiết
                    </button>
                  )}
                </div>

                {!n.read ? (
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => onMarkOne(n.id)}
                    isLoading={busy === n.id}
                  >
                    Đánh dấu đã đọc
                  </Button>
                ) : (
                  <span className="text-xs text-gray-500">Đã đọc</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
