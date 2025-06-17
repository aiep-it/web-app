"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button'; 
import { Input } from '@heroui/input'; 
import { toast } from 'react-hot-toast'; 


import { Textarea } from "@heroui/input"; 

const AddCategoryPage: React.FC = () => {
    const { getToken, isSignedIn, isLoaded: isClerkLoaded } = useAuth(); 
    const router = useRouter();

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState<number>(0);
    const [loading, setLoading] = useState(false); // Trạng thái submit form
    const [formError, setFormError] = useState<string | null>(null); // Dùng tên khác để tránh nhầm lẫn với error từ toast

    const [userRole, setUserRole] = useState<string | null>(null); 
    const [isRoleLoading, setIsRoleLoading] = useState(true); 

    useEffect(() => {
        const fetchUserRole = async () => {
            // Chỉ fetch role nếu Clerk đã tải xong VÀ người dùng đã đăng nhập VÀ userRole chưa được set
            if (!isClerkLoaded || !isSignedIn) {
                // Nếu chưa tải xong hoặc chưa đăng nhập, kết thúc sớm
                setIsRoleLoading(false); // Không loading role nếu không có user
                setUserRole(null);
                return;
            }

            setIsRoleLoading(true); // Bắt đầu tải vai trò
            try {
                const token = await getToken();
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
                const res = await fetch(`${backendUrl}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    if (res.status === 404) {
                        console.warn('User not found in database, setting role to default (user).');
                        setUserRole('user'); // Mặc định là 'user' nếu chưa sync vào DB của bạn
                    } else {
                        throw new Error(errorData.message || 'Failed to fetch user role');
                    }
                } else {
                    const data = await res.json();
                    setUserRole(data.role); // Gán role từ phản hồi của backend
                }
            } catch (err: any) {
                console.error('Error fetching user role:', err);
                toast.error(err.message || 'Lỗi khi lấy thông tin vai trò');
                setUserRole(null); // Đặt lại role nếu có lỗi
            } finally {
                setIsRoleLoading(false); // Kết thúc tải vai trò
            }
        };

        fetchUserRole();
    }, [isClerkLoaded, isSignedIn, getToken]);

    // --- Các điều kiện hiển thị Loading / Đăng nhập / Không có quyền ---
    if (!isClerkLoaded || isRoleLoading) {
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

    if (userRole !== 'admin' && userRole !== 'staff') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="text-xl">Ông đâu phải admin hehe (Vai trò: {userRole || 'Không xác định'})</p>
            </div>
        );
    }
    // --- Kết thúc các điều kiện hiển thị ---

    // ✅ Form chính (Chỉ hiển thị khi đã đăng nhập và có quyền)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null); // Reset lỗi form

        // Kiểm tra dữ liệu bắt buộc (client-side validation)
        if (!name.trim() || !type.trim()) {
            setFormError('Tên và Loại Category là bắt buộc.'); // Set lỗi hiển thị dưới form
            toast.error('Vui lòng nhập tên và loại category.');
            return;
        }

        setLoading(true); // Bắt đầu trạng thái submit form

        try {
            const token = await getToken();
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
            const res = await fetch(`${backendUrl}/categories`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, type, description, order }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Lỗi khi thêm danh mục');
            }

            toast.success('Thêm danh mục thành công!');
            // Reset form
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
                    {/* Input Tên Category */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Tên Category <span className="text-red-500">*</span></label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Frontend Developer"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>

                    {/* Input Loại Category */}
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

                    {/* Input Mô tả */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô tả (Tùy chọn)</label>
                        <Textarea // Sử dụng Textarea từ @heroui/input (như code bạn)
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn về Category này..."
                            rows={3}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Input Thứ tự hiển thị */}
                    <div>
                        <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1">Thứ tự hiển thị (Tùy chọn)</label>
                        <Input
                            id="order"
                            type="number"
                            value={order.toString()}
                            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Hiển thị lỗi form (nếu có) */}
                    {formError && (
                        <p className="text-red-500 text-sm text-center">{formError}</p>
                    )}

                    {/* Nút hành động */}
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