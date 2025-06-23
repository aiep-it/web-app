"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

const AddCategoryPage: React.FC = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { userRole, isRoleLoading, isSignedIn } = useUserRole();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Đang tải thông tin người dùng và quyền hạn...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Vui lòng đăng nhập để truy cập trang này.</p>
        <Button onClick={() => router.push('/sign-in')} className="ml-4 bg-primary-500 hover:bg-primary-600 text-white">
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (userRole !== "admin" && userRole !== "staff") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Ông đâu phải admin hehe (Vai trò: {userRole || "Không xác định"})</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !type.trim()) {
      setFormError('Tên và Loại Category là bắt buộc.');
      toast.error('Vui lòng nhập tên và loại category.');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${backendUrl}/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type, description, order }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Lỗi khi thêm danh mục');
      }

      toast.success('Thêm danh mục thành công!');
      setName('');
      setType('');
      setDescription('');
      setOrder(0);
      router.push('/');
    } catch (err: any) {
      setFormError(err.message || 'Đã xảy ra lỗi khi gửi biểu mẫu');
      toast.error(err.message || 'Đã xảy ra lỗi khi gửi biểu mẫu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8 flex justify-center items-start">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-400">Tạo Category Mới</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Tên Category <span className="text-red-500">*</span></label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Frontend Developer"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Loại Category <span className="text-red-500">*</span></label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Chọn loại</option>
              <option value="role">Role Based</option>
              <option value="skill">Skill Based</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô tả (Tùy chọn)</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về Category này..."
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1">Thứ tự hiển thị (Tùy chọn)</label>
            <Input
              id="order"
              type="number"
              value={order.toString()}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="border border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={loading}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {loading ? 'Đang tạo...' : 'Tạo Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
