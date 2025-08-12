'use client';
import { useParams } from 'next/navigation';
import RoadMapDetailPage from './RoadMapDetailPage';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <RoadMapDetailPage id={id} />;
}
