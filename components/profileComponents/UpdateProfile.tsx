// web-app/components/UpdateProfile.tsx
'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function UpdateProfile() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const handleUpdate = async () => {
    if (!user) return;
    try {
      await user.update({
        firstName,
        lastName,
      });
      alert('Hồ sơ đã được cập nhật');
    } catch (err) {
      console.error('Lỗi cập nhật hồ sơ:', err);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Tên"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Họ"
        className="border p-2 mb-2 w-full"
      />
      <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded">
        Cập nhật
      </button>
    </div>
  );
}