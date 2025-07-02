'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getAllRoadmaps } from '@/services/roadmap';
import { getAllCategories } from '@/services/category';
import { Roadmap } from '@/services/types/roadmap';
import { Category } from '@/services/types/category';
import ProfileSection from '@/components/RoadmapComponents/ProfileSection';
import PersonalManagementSection from '@/components/RoadmapComponents/PersonalManagementSection';
import RoadmapSection from '@/components/RoadmapComponents/RoadmapSection';

export default function RoadmapPageContainer() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const t = await getToken();
        setToken(t || '');

        const [rms, cats] = await Promise.all([
          getAllRoadmaps(t || ''),
          getAllCategories( ),
        ]);
        setRoadmaps(rms);
        setCategories(cats);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, getToken]);

  const learningRoadmaps = roadmaps.filter(
    (rm) => (rm.progressPercentage > 0 || rm.isBookmarked) && !rm.is_deleted
  );

  if (loading) {
    return <div className="text-center text-white py-10">Đang tải dữ liệu...</div>;
  }

  return (
    <main className="min-h-screen text-black dark:text-white p-6 md:p-8">
      <ProfileSection />
      <PersonalManagementSection learningRoadmaps={learningRoadmaps} />

      {categories.length > 0 ? (
        <div className="mb-8">
          {categories.map((category) => {
            const filtered = roadmaps.filter(
              (rm) => rm.categoryId === category.id && !rm.is_deleted
            );

            return (
              <div key={category.id} className="mb-8">
                <h3 className="text-2xl font-bold mb-4 mt-8 border-b border-gray-700 pb-2">
                  {category.name}
                </h3>

                {filtered.length > 0 ? (
                  <RoadmapSection
                    title=""
                    roadmaps={filtered}
                    setRoadmaps={setRoadmaps}
                    clerkToken={token}
                  />
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Hiện chưa có lộ trình nào trong danh mục này.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-white text-center py-8 text-xl">
          Chưa có danh mục lộ trình nào được tạo.
        </div>
      )}
    </main>
  );
}
