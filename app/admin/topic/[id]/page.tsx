import TopicDetail from "./TopicDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <TopicDetail id={params.id} />;
}