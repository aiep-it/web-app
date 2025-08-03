import TopicEditPage from "./TopicEditPage";


export default function Page({ params }: { params: { id: string } }) {
  return <TopicEditPage id={params.id} />;
}