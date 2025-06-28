import RoadMapDetailPage from "./RoadMapDetailPage";

export default function Page({ params }: { params: { id: string } }) {
  return <RoadMapDetailPage id={params.id} />;
}