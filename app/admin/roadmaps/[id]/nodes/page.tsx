import NewNodesPage from "./NewNodesPage";


export default function Page({ params }: { params: { id: string } }) {
  return <NewNodesPage id={params.id} />;
}