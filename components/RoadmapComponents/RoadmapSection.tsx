"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Roadmap } from "@/services/types/roadmap";
import { toggleBookmark } from "@/services/bookmark";
import { useRouter } from "next/navigation";

interface RoadmapSectionProps {
  title: string;
  roadmaps: Roadmap[];
  setRoadmaps: React.Dispatch<React.SetStateAction<Roadmap[]>>;
  clerkToken: string | null;
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  title,
  roadmaps,
  setRoadmaps,
  clerkToken,
}) => {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const router = useRouter();
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({}); // roadmapId -> isLoading

  const handleToggleBookmark = useCallback(
    async (roadmapId: string, currentBookmark: boolean) => {
      if (!isLoaded) return toast.error("Clerk đang tải...");
      if (!isSignedIn || !userId || !clerkToken)
        return toast.error("Vui lòng đăng nhập để lưu lộ trình.");

      // Optimistic UI
      setRoadmaps((prev) =>
        prev.map((rm) =>
          rm.id === roadmapId ? { ...rm, isBookmarked: !currentBookmark } : rm
        )
      );

      setLoadingMap((prev) => ({ ...prev, [roadmapId]: true }));

      try {
        await toggleBookmark(roadmapId, !currentBookmark, clerkToken);
        toast.success(`${!currentBookmark ? "Đã lưu" : "Đã bỏ lưu"} lộ trình.`);
      } catch (err) {
        // Rollback UI
        setRoadmaps((prev) =>
          prev.map((rm) =>
            rm.id === roadmapId ? { ...rm, isBookmarked: currentBookmark } : rm
          )
        );
        toast.error("Lỗi cập nhật bookmark.");
      } finally {
        setLoadingMap((prev) => ({ ...prev, [roadmapId]: false }));
      }
    },
    [clerkToken, isSignedIn, isLoaded, setRoadmaps, userId]
  );

  return (
    <div className="mb-8 p-4 rounded-xl shadow-xl transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.map((roadmap) => {
          const isLoading = loadingMap[roadmap.id];
          return (
            <Card
              key={roadmap.id}
              className="p-4 relative rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-transform transform hover:scale-[1.02] hover:shadow-xl border border-gray-200 dark:border-gray-700 group"
            >
              <Link href={`/roadmaps/${roadmap.id}`} className="absolute inset-0 z-0" />
              <div className="relative z-10 flex justify-between items-start mb-3">
                <span className="text-xl font-semibold pr-8 truncate">
                  {roadmap.name}
                </span>

                <button
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleBookmark(roadmap.id, roadmap.isBookmarked);
                  }}
                  className="transition-transform duration-200 ease-in-out active:scale-90"
                >
                  <Icon
                    icon={
                      roadmap.isBookmarked
                        ? "lucide:bookmark"
                        : "lucide:bookmark-plus"
                    }
                    className={`text-2xl transition-colors ${
                      roadmap.isBookmarked
                        ? "text-primary-500 group-hover:text-primary-600"
                        : "text-gray-400 group-hover:text-primary-500"
                    } ${isLoading ? "opacity-50" : ""}`}
                  />
                </button>
              </div>

              {roadmap.progressPercentage > 0 && (
                <>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full shadow-sm transition-all"
                      style={{ width: `${roadmap.progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-right mt-2 text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {roadmap.progressPercentage.toFixed(0)}%
                    </span>{" "}
                    Complete
                  </p>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapSection;
