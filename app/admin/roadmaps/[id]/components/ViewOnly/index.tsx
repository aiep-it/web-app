"use client";
import CDrawer from "@/components/CDrawer";
import { DrawerContent } from "@heroui/react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  ReactFlowProvider,
  Node,
  Edge,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useRef, useState } from "react";

import { NodeContent } from "@/types/Node";
import { AnimatedSVGEdge } from "../AnimatedSVGEdge";
import NodeHeader from "../NodeTypes/NodeHeader";
import NodeDetail from "../NodeDetail";

interface IProps {
  nodeData?: Node[];
  edgeData?: Edge[];
  viewPort?: {
    x: number;
    y: number;
    zoom: number;
  };
}
export type NodeFlowRef = {
  getRFInstance: () => ReactFlowInstance | null;
};

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};
const nodeTypes = {
  nodeHeader: NodeHeader,
};

const nodeOrigin: [number, number] = [0.5, 0.0];

const NodeFlowViewOnly = forwardRef<NodeFlowRef, IProps>((props, ref) => {
  const { theme } = useTheme();
  const reactFlowWrapper = useRef(null);
  const [colorMode, setColorMode] = useState<"system" | "dark" | "light">(
    "dark"
  );
  const [nodes, ,] = useNodesState<Node>(props.nodeData || []);
  const [edges, ,] = useEdgesState<Edge>(props.edgeData || []);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [nodeSelected, setNodeSelected] = useState<Node>();



  useEffect(() => {
    if (theme === "dark") setColorMode("dark");
    else if (theme === "light") setColorMode("light");
  }, [theme]);

  const onNodeDoubleClick = (_: any, node: Node) => {
    setNodeSelected(node);
    setIsOpen(true);
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setNodeSelected(undefined);
  };

  useEffect(() => {
    if (nodeSelected?.data?.label) {
      // do nothing; purely for viewing
    }
  }, [nodeSelected]);

  // expose rfInstance if needed
  useEffect(() => {
    if (ref) {
      (ref as any).current = {
        getRFInstance: () => rfInstance,
      };
    }
  }, [rfInstance]);

  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onInit={setRfInstance}
        colorMode={colorMode}
        nodesConnectable={false} 
        fitView
        nodeOrigin={nodeOrigin}
        onNodeClick={onNodeDoubleClick}
        proOptions={{ hideAttribution: true }}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        selectionOnDrag={false}
        nodesDraggable={false}
      >
      </ReactFlow>

      <CDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <NodeDetail
              nodeId={nodeSelected?.id}
              onClose={onClose}
            />
          )}
        </DrawerContent>
      </CDrawer>
    </div>
  );
});

export default function NodeFlowViewOnlyWrapper(props: IProps) {
  return (
    <ReactFlowProvider>
      <NodeFlowViewOnly {...props} />
    </ReactFlowProvider>
  );
}
