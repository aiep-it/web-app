// app/admin/roadmaps/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import RoadMapDetailPage from "./RoadMapDetailPage";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  return <RoadMapDetailPage id={id} />;
}
