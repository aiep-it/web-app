"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Spinner } from "@heroui/react";
import TitleSection from "./components/TitleSection";
import NodeFlowViewOnlyWrapper from "@/app/admin/roadmaps/[id]/components/ViewOnly";
import { getRoadmapById } from "@/services/roadmap";
import { getItems } from "@/services/cms";
import { Roadmap } from "@/services/types/roadmap";
import { NodeViewCMS } from "@/services/types/node";
import { COLLECTIONS } from "@/config/cms";

const RoadmapPage = () => {
  const { userId, getToken, isLoaded } = useAuth();
  const params = useParams();
  const id = params?.id as string;

  const [selectedTab, setSelectedTab] = useState("roadmap");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [nodeViewContent, setNodeViewContent] = useState<NodeViewCMS | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !id) return;

      const token = await getToken();
      if (!token) return;

      const data = await getRoadmapById(id, token);
      if (data) {
        setRoadmap(data);

        const res = await getItems<NodeViewCMS>(COLLECTIONS.NodeView, {
          filter: {
            roadmapId: {
              _eq: id,
            },
          },
        });

        if (res && res.length > 0) {
          setNodeViewContent(res[0]);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, isLoaded, getToken]);

  if (loading || !roadmap) return <div className="p-4">Đang tải lộ trình...</div>;

  return (
    <>
      <TitleSection
        title={roadmap.name}
        subtitle={roadmap.description || "No description available."}
        progress={{
          done: 9, // mock value
          total: 115, // mock value
          percentage:
            roadmap.progressPercentage !== null && roadmap.progressPercentage !== undefined
              ? roadmap.progressPercentage
              : 50,
        }}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        faqContent={[
          {
            title: "What is a Frontend Developer?",
            content: `A frontend developer is a professional who uses HTML, CSS, and JavaScript...`,
          },
        ]}
      />

      <div className="mb-6  bg-inherit dark:bg-inherit">
        {!loading ? (
          nodeViewContent ? (
            <div className="h-[600px] w-full rounded-xl border border-default-200 dark:border-default-100 overflow-hidden">
              <NodeFlowViewOnlyWrapper
                nodeData={nodeViewContent.nodes || []}
                edgeData={nodeViewContent.edges || []}
                viewPort={nodeViewContent.viewport}
              />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-default-200 bg-default-50">
              <p className="text-default-500">No Exist Nodes</p>
            </div>
          )
        ) : (
          <Spinner
            label="Loading roadmap view..."
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>
    </>
  );
};

export default RoadmapPage;
