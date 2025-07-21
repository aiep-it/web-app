import NewTopicsPage from "./NewTopicsPage";


export default function Page({ params }: { params: { id: string } }) {
  return <NewTopicsPage id={params.id} />;
}