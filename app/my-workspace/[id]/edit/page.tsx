import TopicEditPage from "@/app/admin/topic/[id]/edit/TopicEditPage";

export default function Page({ params }: { params: { id: string } }) {
  return <TopicEditPage id={params.id} />;
}