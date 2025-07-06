import NodesListPage from "./NodesListPage";



export default function Page({ params }: { params: { id: string } }) {
  return <NodesListPage roadMapId={params.id} />;
}