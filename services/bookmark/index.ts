// services/bookmark.ts
import axiosInstance from "@/lib/axios";

export const toggleBookmark = async (
  roadmapId: string,
  bookmark: boolean,
  token: string
): Promise<void> => {
  const endpoint = `/roadmaps/${roadmapId}/bookmark`;

  try {
    await axiosInstance.post(
      endpoint,
      { bookmark },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    const message = error?.response?.data?.message || "Không thể cập nhật bookmark.";
    throw new Error(message);
  }
};
