import NodeDetail from "./NodeDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <NodeDetail id={params.id} />;
}