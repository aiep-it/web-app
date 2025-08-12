'use client';
import { useParams } from 'next/navigation';
import TopicEditor from '../components/TopicEditor';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <TopicEditor id={id} />;
}
