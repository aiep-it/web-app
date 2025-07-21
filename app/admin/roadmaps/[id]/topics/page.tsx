import TopicsListPage from "./TopicsListPage";



export default function Page({ params }: { params: { id: string } }) {
  return <TopicsListPage roadMapId={params.id} />;
}