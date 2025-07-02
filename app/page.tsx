import { Metadata } from 'next';
import RoadmapPageContainer from './RoadmapPageContainer';

export const metadata: Metadata = {
  title: 'Trang Chủ Học Tập Của Tôi',
  description: 'Trang chủ của nền tảng học tập với các lộ trình vai trò và kỹ năng.',
};

export default function HomePage() {
  return <RoadmapPageContainer />;
}
