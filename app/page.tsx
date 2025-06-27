// 📁 app/page.tsx
import ProfileSection from '@/components/RoadmapComponents/ProfileSection';
import PersonalManagementSection from '@/components/RoadmapComponents/PersonalManagementSection';
import RoadmapSection from '@/components/RoadmapComponents/RoadmapSection';
import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import {  getAllRoadmaps } from '@/services/roadmap';
import { getAllCategories } from '@/services/category';

export const metadata: Metadata = {
  title: 'Trang Chủ Học Tập Của Tôi',
  description: 'Trang chủ của nền tảng học tập với các lộ trình vai trò và kỹ năng.',
};

export default async function HomePage() {
  const { sessionId, userId, getToken } = await auth();

  let clerkToken: string | null = null;
  if (sessionId) {
    clerkToken = await getToken();
  }

  const allRoadmaps = await getAllRoadmaps(clerkToken ?? '');
  const categories = await getAllCategories();

  const sortedCategories = categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const learningRoadmaps = allRoadmaps.filter(
    rm => (rm.progressPercentage > 0 || rm.isBookmarked) && !rm.is_deleted
  );

  const uncategorizedRoadmaps = allRoadmaps.filter(
    (rm) => (!rm.categoryId || !categories.find(c => c.id === rm.categoryId)) && !rm.is_deleted
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      <ProfileSection />
      <PersonalManagementSection learningRoadmaps={learningRoadmaps} />

      {sortedCategories.length > 0 && (
        <div className="mb-8">
          {sortedCategories.map(category => {
            const filteredRoadmaps = allRoadmaps.filter(
              (rm) => rm.categoryId === category.id && !rm.is_deleted
            );

            return (
              <div key={category.id} className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white mt-8 border-b border-gray-700 pb-2">
                  {category.name}
                </h3>
                {filteredRoadmaps.length > 0 ? (
                  <RoadmapSection
                    title=""
                    roadmaps={filteredRoadmaps}
                    clerkToken={clerkToken}
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
      )}

      {sortedCategories.length === 0 && (
        <div className="text-white text-center py-8 text-xl">
          Chưa có danh mục lộ trình nào được tạo.
        </div>
      )}
    </main>
  );
}
