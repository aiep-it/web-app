import NodeEditPage from "./TopicEditPage";


export default function Page({ params }: { params: { id: string } }) {
  return <NodeEditPage id={params.id} />;
}