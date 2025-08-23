'use client';
import MyReport from '@/app/report/me/MyReport';
import { useParams } from 'next/navigation';

export default function Page({ params }: { params: { childrenId: string } }) {
  const { childrenId } = useParams<{ childrenId: string }>();
  return <MyReport stdId={childrenId} />;
}
