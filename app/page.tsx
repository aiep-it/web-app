// app/page.tsx
import ProfileSection from '@/components/RoadmapComponents/ProfileSection';
import PersonalManagementSection from '@/components/RoadmapComponents/PersonalManagementSection';
import RoadmapSection from '@/components/RoadmapComponents/RoadmapSection';
import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import TokenDisplay from '@/components/token-display';

export const metadata: Metadata = {
  title: 'Trang Chủ Học Tập Của Tôi',
  description: 'Trang chủ của nền tảng học tập với các lộ trình vai trò và kỹ năng.',
};

// Định nghĩa kiểu dữ liệu cho Roadmap
interface Roadmap {
  id: string;
  name: string;
  categoryId: string;
  type: string; // Vẫn giữ type vì nó có trong DB và dữ liệu của bạn, nhưng không dùng để lọc hiển thị
  is_deleted?: boolean;
  isNew?: boolean;
  progressPercentage: number;
  isBookmarked: boolean;
}

// Định nghĩa kiểu dữ liệu cho Category
interface Category {
  id: string;
  name: string;
  type: string; // Vẫn giữ type vì nó có trong DB, nhưng không dùng để lọc hiển thị
  order: number;
}

async function fetchRoadmaps(clerkToken: string | null): Promise<Roadmap[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (clerkToken) {
    headers['Authorization'] = `Bearer ${clerkToken}`;
  }

  try {
    const res = await fetch(`${backendUrl}/roadmaps`, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(`Failed to fetch roadmaps: ${res.status} - ${JSON.stringify(errorData)}`);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${backendUrl}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(`Failed to fetch categories: ${res.status} - ${JSON.stringify(errorData)}`);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}


export default async function HomePage() {
  const { sessionId, userId, getToken } = await auth();

  let clerkToken: string | null = null;
  if (sessionId) {
    clerkToken = await getToken();
  }

  console.log('Server Component - clerkToken:', clerkToken ? 'Token is present' : 'Token is NULL');
  console.log('Server Component - userId from auth():', userId);
  console.log('Server Component - sessionId from auth():', sessionId);


  const allRoadmaps = await fetchRoadmaps(clerkToken);
  const categories = await fetchCategories();

  // CHỈ SẮP XẾP CÁC CATEGORY, KHÔNG LỌC THEO TYPE Ở ĐÂY NỮA
  const sortedCategories = categories.sort((a, b) => a.order - b.order);

  const learningRoadmaps = allRoadmaps.filter(rm => rm.progressPercentage > 0 && !rm.is_deleted);


  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      <TokenDisplay />

      <ProfileSection />
      <PersonalManagementSection learningRoadmaps={learningRoadmaps} />

      {/* Hiển thị TẤT CẢ các Category theo đúng ý bạn */}
      {sortedCategories.length > 0 && (
        <div className="mb-8">
          
          {sortedCategories.map(category => {
            // Lọc roadmaps chỉ theo categoryId (và is_deleted)
            const filteredRoadmaps = allRoadmaps.filter(
              (rm) =>
                rm.categoryId === category.id &&
                !rm.is_deleted // Vẫn giữ điều kiện này
            );

            return (
              <div key={category.id} className="mb-8">
                {/* Tiêu đề của Category */}
                <h3 className="text-2xl font-bold mb-4 text-white mt-8 border-b border-gray-700 pb-2">
                  {category.name}
                </h3>

                {/* Kiểm tra và hiển thị Roadmaps hoặc thông báo rỗng */}
                {filteredRoadmaps.length > 0 ? (
                  <RoadmapSection
                    title="" // Không cần tiêu đề phụ trong RoadmapSection nữa
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
      {/* Trường hợp không có category nào */}
      {sortedCategories.length === 0 && (
        <div className="text-white text-center py-8 text-xl">
          Chưa có danh mục lộ trình nào được tạo.
        </div>
      )}
    </main>
  );
}