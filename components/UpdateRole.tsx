// web-app/components/UpdateRole.tsx
'use client';
import { useUser } from '@clerk/nextjs';

export default function UpdateRole() {
  const { user } = useUser();
 console.log('Current user:', user);
  const handleUpdateRole = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3000/api/users/update-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: 'admin' }),
      });
      if (response.ok) {
        alert('Role updated');
      } else {
        throw new Error('Failed to update role');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button onClick={handleUpdateRole} className="bg-green-500 text-white p-2 rounded">
      Set Admin Role
    </button>
  );
}