// app/class-room/[id]/page.tsx
import ClassRoomPage from './ClassRoomPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;   
  return <ClassRoomPage classId={id} />;
}
