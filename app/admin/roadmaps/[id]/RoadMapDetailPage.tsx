"use client";
import React, { use, useEffect, useRef } from "react";
import NodeFlow, { NodeFlowRef } from "./components/NodeFlow";
import "@xyflow/react/dist/style.css";
import { Button, Card, CardBody, CardHeader, Chip, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Node } from "@xyflow/react";
import ButtonConfirm from "@/components/ButtonConfirm";
import { getRoadmapById } from "@/services/roadmap";
import NodeFlowViewOnlyWrapper from "./components/ViewOnly";
import { Roadmap } from "@/services/types/roadmap";

// Mock
const defaultEdges = [
  {
    id: "randomnode_1750581671989",
    source: "1",
    target: "randomnode_1750581671989",
    type: "animatedSvg",
  },
  {
    id: "randomnode_1750581674721",
    source: "1",
    target: "randomnode_1750581674721",
    type: "animatedSvg",
  },
];
const defaultNodes: Node[] = [
  {
    id: "1",
    position: {
      x: 200,
      y: 200,
    },
    data: {
      label: "Group Node",
    },
    width: 380,
    height: 200,
    type: "labeledGroupNode",
    measured: {
      width: 380,
      height: 200,
    },
  },
  {
    id: "2",
    position: {
      x: 50,
      y: 100,
    },
    data: {
      label: "Node",
    },
    type: "input",
    parentId: "1",
    extent: "parent",
    measured: {
      width: 150,
      height: 40,
    },
  },
  {
    id: "3",
    position: {
      x: 200,
      y: 50,
    },
    data: {
      label: "Node",
    },
    type: "input",
    parentId: "1",
    extent: "parent",
    measured: {
      width: 150,
      height: 40,
    },
    selected: false,
  },
  {
    id: "randomnode_1750581671989",
    position: {
      x: 167.30039764239902,
      y: 536.5656190897445,
    },
    data: {
      label: "Child_Group Node",
    },
    origin: [0.5, 0],
    measured: {
      width: 150,
      height: 40,
    },
  },
  {
    id: "randomnode_1750581674721",
    position: {
      x: 480.9930698671532,
      y: 580.3830082259007,
    },
    data: {
      label: "Child_Group Node",
    },
    origin: [0.5, 0],
    measured: {
      width: 150,
      height: 40,
    },
  },
];
const defaultViewport = {
  x: 520.0023707165288,
  y: 261.1982204921525,
  zoom: 1.0041675432389734,
};

interface RoadMapDetailPageProps {
  id: string;
}

const RoadMapDetailPage: React.FC<RoadMapDetailPageProps> = ({ id }) => {
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>();

  useEffect(() => {
    const fetchRoadmap = async () => {
      const res = await getRoadmapById(id);

      setRoadmap(res);
    };

    fetchRoadmap();
  }, [id]);

  return (
    <div className="flex justify-center items-center h-full mt-auto">
      <Card className="w-full h-full">
        <CardHeader className=" flex justify-between">
        <div className="p-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {roadmap?.name || "Roadmap Name"}
                </h1>
                <Chip variant="flat" color="secondary">
                  {roadmap?.category?.name || "Roadmap Name"}
                </Chip>
                <p className="text-foreground-500 mt-1">
                  {roadmap?.description || "Roadmap Desctiption"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Button color="primary" variant="bordered">
              Edit Roadmap
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <NodeFlowViewOnlyWrapper
            nodeData={defaultNodes}
            edgeData={defaultEdges}
            viewPort={defaultViewport}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default RoadMapDetailPage;
