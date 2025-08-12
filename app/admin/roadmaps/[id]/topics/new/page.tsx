import TopicEditPage from "@/app/admin/topic/[id]/edit/TopicEditPage";
import NewTopicsPage from "./NewTopicsPage";
import TopicEditor from "../../components/TopicEditor";


export default function Page({ params }: { params: { id: string } }) {
  return <TopicEditor id={params.id} />;
}