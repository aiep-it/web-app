// web-app/app/profile/page.tsx
import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <UserProfile />
    </div>
  );
}