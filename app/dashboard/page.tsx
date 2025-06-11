// web-app/app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return <div>Vui lòng đăng nhập để xem trang này</div>;
  }

  return (
    <div className="p-4">
      <h1>Xin chào, {user?.firstName}</h1>
      <p>Email: {user?.emailAddresses[0].emailAddress}</p>
    </div>
  );
}