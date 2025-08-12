// web-app\components\RoadmapComponents\RoadmapSection.tsx
"use client";

import React, { useEffect } from 'react'; // Vẫn cần useEffect để debug/quan sát
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Badge } from "@heroui/badge";
import { useRouter } from 'next/navigation';

interface Roadmap {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  isNew?: boolean;
  progressPercentage: number;
  is_deleted?: boolean;
  isBookmarked: boolean; 
}

interface RoadmapSectionProps {
  title: string;
  roadmaps: Roadmap[];
  clerkToken: string | null; // Nhận token từ page.tsx
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ title, roadmaps, clerkToken }) => {

  const { isSignedIn, userId, isLoaded } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
   
  }, [isLoaded, isSignedIn, userId, clerkToken]);


  const handleToggleBookmark = async (roadmapId: string, currentBookmarkStatus: boolean) => {
    if (!isLoaded) {
      alert("Clerk đang tải... Vui lòng thử lại sau giây lát.");
      return;
    }
    if (!isSignedIn || !userId || !clerkToken) {
      alert("Vui lòng đăng nhập để lưu lộ trình.");
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${backendUrl}/roadmaps/${roadmapId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clerkToken}`,
        },
        body: JSON.stringify({ bookmark: !currentBookmarkStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to toggle bookmark');
      }

      router.refresh(); // Làm mới dữ liệu Server Component
      alert(`Lộ trình đã ${!currentBookmarkStatus ? 'lưu' : 'bỏ lưu'}.`);

    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      alert(`Không thể cập nhật trạng thái lưu lộ trình: ${error.message || ''}`);
    }
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.map((roadmap) => {
          const isBookmarked = roadmap.isBookmarked;

          return (
            <Card key={roadmap.id} className="p-4 bg-white text-gray-900 relative rounded-md hover:bg-gray-50 transition-colors border border-gray-200">
              <Link href={`/roadmaps/${roadmap.id}`} className="absolute inset-0 z-0"></Link>
              <div className="relative z-10 flex justify-between items-center mb-2">
                <span className="text-lg font-medium pr-8 truncate">{roadmap.name}</span>
                {roadmap.isNew && (
                  <Badge color="secondary" className="absolute top-0 right-0 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    New
                  </Badge>
                )}
                <Icon
                  icon={isBookmarked ? "lucide:bookmark" : "lucide:bookmark-plus"}
                  className={`text-xl cursor-pointer ${isBookmarked ? 'text-primary-500' : 'text-gray-400'} hover:text-primary-400 transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggleBookmark(roadmap.id, isBookmarked);
                  }}
                />
              </div>
              {roadmap.progressPercentage > 0 && (
                 <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                   {/* <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${roadmap.progressPercentage}%` }}></div> */}
                   <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${roadmap.progressPercentage}%` }}></div>
                 </div>
              )}
              {roadmap.progressPercentage > 0 && (
                <p className="text-sm text-right mt-1 text-foreground-400">
                  {roadmap.progressPercentage.toFixed(0)}% Complete
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapSection;
