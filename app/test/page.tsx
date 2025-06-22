'use client';
import UpdateProfile from '@/components/profileComponents/UpdateProfile';
import UpdateRole from '@/components/profileComponents/UpdateRole';

export default function TestPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Test Update Profile & Role</h1>
      <UpdateProfile />
      <UpdateRole />
    </div>
  );
}