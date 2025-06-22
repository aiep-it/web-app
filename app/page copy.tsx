// // app/page.tsx
// import ProfileSection from '@/components/RoadmapComponents/ProfileSection';
// import PersonalManagementSection from '@/components/RoadmapComponents/PersonalManagementSection';
// import RoadmapSection from '@/components/RoadmapComponents/RoadmapSection';
// import type { Metadata } from 'next';
// import { auth } from '@clerk/nextjs/server';

// // import TokenDisplay from '@/components/TokenDisplay'; // Giữ nguyên comment

// export const metadata: Metadata = {
//   title: 'Trang Chủ Học Tập Của Tôi',
//   description: 'Trang chủ của nền tảng học tập với các lộ trình vai trò và kỹ năng.',
// };

// // Định nghĩa kiểu dữ liệu cho Roadmap
// interface Roadmap {
//   id: string;
//   name: string;
//   categoryId: string;
//   type: string;
//   is_deleted?: boolean;
//   isNew?: boolean;
//   progressPercentage: number;
//   isBookmarked: boolean;
// }

// // Định nghĩa kiểu dữ liệu cho Category
// interface Category {
//   id: string;
//   name: string;
//   type: string;
//   order: number;
// }


// async function fetchRoadmaps(clerkToken: string | null): Promise<Roadmap[]> {
//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//   };
//   if (clerkToken) {
//     headers['Authorization'] = `Bearer ${clerkToken}`;
//   }

//   try {
//     const res = await fetch(`${backendUrl}/roadmaps`, {
//       method: 'GET',
//       headers: headers,
//       next: { revalidate: 0 }
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       console.error(`Failed to fetch roadmaps: ${res.status} - ${JSON.stringify(errorData)}`);
//       return [];
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching roadmaps:', error);
//     return [];
//   }
// }

// async function fetchCategories(): Promise<Category[]> {
//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
//   try {
//     const res = await fetch(`${backendUrl}/categories`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//       next: { revalidate: 0 }
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       console.error(`Failed to fetch categories: ${res.status} - ${JSON.stringify(errorData)}`);
//       return [];
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   }
// }


// export default async function HomePage() {
//   const { sessionId, userId, getToken } = auth(); // Lấy từ Server Component auth()

//   let clerkToken: string | null = null;
//   if (sessionId) { // Chỉ cố gắng lấy token nếu có session ID
//     clerkToken = await getToken();
//   }

//   // ✅ Debugging: Log giá trị của clerkToken trên Server
//   console.log('Server Component - clerkToken:', clerkToken ? 'Token is present' : 'Token is NULL');
//   console.log('Server Component - userId from auth():', userId); // Kiểm tra userId từ auth()
//   console.log('Server Component - sessionId from auth():', sessionId); // Kiểm tra sessionId từ auth()


//   const allRoadmaps = await fetchRoadmaps(clerkToken);
//   const categories = await fetchCategories();

//   const roleBasedCategories = categories.filter(cat => cat.type === 'role').sort((a, b) => a.order - b.order);
//   const skillBasedCategories = categories.filter(cat => cat.type === 'skill').sort((a, b) => a.order - b.order);

//   const learningRoadmaps = allRoadmaps.filter(rm => rm.progressPercentage > 0 && !rm.is_deleted);


//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
//       {/* <TokenDisplay /> */} {/* Bạn đã comment TokenDisplay, có thể bỏ qua */}

//       <ProfileSection />
//       <PersonalManagementSection learningRoadmaps={learningRoadmaps} />

//       {roleBasedCategories.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold mb-6 text-white border-b-2 border-primary-500 pb-2">Role Based Roadmaps</h2>
//           {roleBasedCategories.map(category => {
//             const filteredRoadmaps = allRoadmaps.filter(
//               (rm) => rm.categoryId === category.id && rm.type === 'role-based' && !rm.is_deleted
//             );
//             if (filteredRoadmaps.length === 0) return null;
//             return (
//               <RoadmapSection
//                 key={category.id}
//                 title={category.name}
//                 roadmaps={filteredRoadmaps}
//                 clerkToken={clerkToken} // Truyền token xuống Client Component
//               />
//             );
//           })}
//         </div>
//       )}

//       {skillBasedCategories.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold mb-6 text-white border-b-2 border-primary-500 pb-2">Skill Based Roadmaps</h2>
//           {skillBasedCategories.map(category => {
//             const filteredRoadmaps = allRoadmaps.filter(
//               (rm) => rm.categoryId === category.id && rm.type === 'skill-based' && !rm.is_deleted
//             );
//             if (filteredRoadmaps.length === 0) return null;
//             return (
//               <RoadmapSection
//                 key={category.id}
//                 title={category.name}
//                 roadmaps={filteredRoadmaps}
//                 clerkToken={clerkToken}
//               />
//             );
//           })}
//         </div>
//       )}
//     </main>
//   );
// }
