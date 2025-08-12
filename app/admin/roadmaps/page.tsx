'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import BaseCard from '@/components/card/BaseCard';
import AdminPageHeader from '@/components/AdminPageHeader';
import { Accordion, AccordionItem } from '@heroui/react';
import { getAllCategories } from '@/services/category';
import { Roadmap } from '@/services/types/roadmap';
import { Category } from '@/services/types/category';
import { getRoadmap } from '@/services/roadmap';


const RoadmapListPage = () => {
  const { getToken } = useAuth();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  const router = useRouter();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchRoadmaps = async () => {
    try {
      
      const data = await getRoadmap();
      setRoadmaps(data);
    } catch (err) {
      toast.error('Không thể tải roadmap');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      toast.error('Không thể tải danh mục');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${backendUrl}/roadmaps/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Xoá thất bại');

      toast.success('Đã xoá roadmap');
      setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error('Lỗi khi xoá roadmap');
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchRoadmaps();
      fetchCategories();
    }
  }, [isSignedIn]);

  if (isRoleLoading)
    return (
      <p className="text-center mt-20 text-gray-400">
        Đang tải quyền người dùng...
      </p>
    );
  if (!isSignedIn)
    return (
      <p className="text-center mt-20 text-red-400">Bạn chưa đăng nhập.</p>
    );

  return (
    <div className="min-h-screen dark:bg-black-10 text-foreground p-6">
      <AdminPageHeader
        title="Tất Cả Lộ Trình Học"
        subTitle="Tất Cả Lộ Trình Học"
        icon="book"
        onRefesh={() => {}}
        onSearch={() => {}}
        addRecord={() => router.push('/admin/roadmaps/new')}
      />
      
        {categories.length > 0 ? (
          <Accordion  className="mt-5" defaultExpandedKeys={categories.map(c => c.id)}>
            {
              categories.map((category) => {
                const filteredRoadmaps = roadmaps.filter(
                  (r) => r.categoryId === category.id,
                );
    
                return (
                  <AccordionItem
                    key={category.id}
                    className="mb-8"
                    aria-label={category.name}
                    title={category.name}
                  >
                    {filteredRoadmaps.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredRoadmaps.map((r) => (
                          <BaseCard
                            key={r.id}
                            id={r.id}
                            name={r.name}
                            description={r.description}
                            onDelete={handleDelete}
                            editUrl={`roadmaps/${r.id}/edit`}
                            viewUrl={`/admin/roadmaps/${r.id}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        Không có roadmap trong danh mục này.
                      </p>
                    )}
                  </AccordionItem>
                );
              })
            }
          </Accordion>
        ) : (
          <p className="text-white text-center py-8 text-xl">
            Chưa có danh mục lộ trình nào được tạo.
          </p>
        )}
    </div>
  );
};

export default RoadmapListPage;
