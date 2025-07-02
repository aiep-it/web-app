
import NodeDetail from './../../../admin/roadmaps/[id]/components/NodeDetail';

export default function Page({ params }: { params: { id: string } }) {
  return <NodeDetail id={params.id} />;
}