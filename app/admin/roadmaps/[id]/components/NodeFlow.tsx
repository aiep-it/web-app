"use client";
import CDrawer from "@/components/CDrawer";
import {
  addToast,
  Button,
  DrawerContent,
  Input,
  PressEvent,
  useDisclosure,
} from "@heroui/react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Edge,
  Node,
  ReactFlowProvider,
  Connection,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Panel,
  ReactFlowInstance,
  ReactFlowProps,
  useStore,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AnimatedSVGEdge } from "./AnimatedSVGEdge";
import NodeDetail from "./TopicDetail";
import { NodeContent } from "@/types/Node";
import { BaseNode } from "@/components/BaseNode";
import NodeHeader from "./NodeTypes/NodeHeader";

interface IProps {
  nodeData?: Node[];
  edgeData?: Edge[];
  viewPort?: {
    x: number;
    y: number;
    zoom: number;
  };
}
interface NodeFlowProps extends IProps, ReactFlowProps {}

export type NodeFlowRef = {
  getRFInstance: () => ReactFlowInstance | null;
};

// === <Static> ===
const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};
const nodeTypes = {
  nodeHeader: NodeHeader,
};
const nodeOrigin: [number, number] = [0.5, 0.0];

const flowKey = "example-flow";
const getNodeId = () => `randomnode_${+new Date()}`;

function getBoundsOfNodes(
  nodes: {
    position: { x: number; y: number };
    width?: number;
    height?: number;
  }[]
) {
  const xValues = nodes.map((n) => n.position.x);
  const yValues = nodes.map((n) => n.position.y);
  const widths = nodes.map((n) => n.width ?? 150); // fallback nếu width bị thiếu
  const heights = nodes.map((n) => n.height ?? 50); // fallback nếu height bị thiếu

  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);
  const maxX = Math.max(...xValues.map((x, i) => x + widths[i]));
  const maxY = Math.max(...yValues.map((y, i) => y + heights[i]));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
// === </Static> ===

const NodeFlow = forwardRef<NodeFlowRef, NodeFlowProps>(
  (props: NodeFlowProps, ref) => {
    const { theme } = useTheme();
    const [colorMode, setColorMode] = useState<"system" | "dark" | "light">(
      "dark"
    );
    const { nodeData, edgeData, ...restProps } = props;

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
      nodeData || []
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(edgeData || []);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(
      null
    );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { screenToFlowPosition, setViewport } = useReactFlow();
    const [nodeSelected, setNodeSelected] = useState<Node>();
    const [labelInput, setLabelInput] = useState("");

    const onConnect = useCallback(
      (params: any) =>
        setEdges((eds) => addEdge({ ...params, type: "animatedSvg" }, eds)),
      []
    );

    const onNodeClick = (event: any, node: Node) => {
      setNodeSelected(node);
    };
    const openDetail = () => {
      onOpen();
    };

    const onSave = useCallback(() => {
      if (rfInstance) {
        const flow = rfInstance?.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        console.log("rfInstance", rfInstance?.toObject());

        addToast({
          title: "Draff Success",
          color: "success",
        });
      }
    }, [rfInstance]);

    const onConnectEnd = useCallback(
      (event: any, connectionState: any) => {
        // when a connection is dropped on the pane it's not valid
        if (!connectionState.isValid) {
          // we need to remove the wrapper bounds, in order to get the correct position
          const id = getNodeId();
          const { clientX, clientY } =
            "changedTouches" in event ? event.changedTouches[0] : event;
          const newNode = {
            id,
            position: screenToFlowPosition({
              x: clientX,
              y: clientY,
            }),
            data: {
              label: `Child_${connectionState.fromNode?.data?.label || "New"}`,
            },
            origin: [0.5, 0.0],
          } as Node;

          setNodes((nds) => nds.concat(newNode));
          setEdges((eds) =>
            eds.concat({
              id,
              source: connectionState.fromNode.id,
              target: id,
              type: "animatedSvg",
            })
          );
        }
      },
      [screenToFlowPosition]
    );

    const onNodesDelete = useCallback(
      (deleted: any) => {
        setEdges(
          deleted.reduce((acc: any, node: Node) => {
            const incomers = getIncomers(node, nodes, edges);
            const outgoers = getOutgoers(node, nodes, edges);
            const connectedEdges = getConnectedEdges([node], edges);

            const remainingEdges = acc.filter(
              (edge: Edge) => !connectedEdges.includes(edge)
            );

            const createdEdges = incomers.flatMap(({ id: source }) =>
              outgoers.map(({ id: target }) => ({
                id: `${source}->${target}`,
                source,
                target,
                type: "animatedSvg",
              }))
            );

            return [...remainingEdges, ...createdEdges];
          }, edges)
        );
      },
      [nodes, edges]
    );

    const onRestore = useCallback(() => {
      const restoreFlow = async () => {
        const saved = localStorage.getItem(flowKey);
        if (saved) {
          const flow = JSON.parse(saved);
          if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
          }
        }
      };

      restoreFlow();
    }, [setNodes, setViewport]);

    const onAdd = useCallback(() => {
      const newNode = {
        id: getNodeId(),
        data: { label: "Added node" },
        position: {
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
        },
        type: "input",
      };
      setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    useEffect(() => {
      if (theme) {
        switch (theme) {
          case "dark":
            setColorMode("dark");
            break;
          case "light":
            setColorMode("light");
            break;
          default:
            break;
        }
      }
    }, [theme]);

    useEffect(() => {
      if (nodeSelected?.data?.label) {
        setLabelInput(nodeSelected.data.label as string);
      }
    }, [nodeSelected]);

    const updateNodeLabel = (nodeId: string, newLabel: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    };

    const onGroupSelectedNodes = useCallback(() => {
      const selected = nodes.filter((n) => n.selected);
      if (selected.length < 2) return;

      const bounds = getBoundsOfNodes(selected);
      const groupId = `group_${Date.now()}`;

      const groupNode: Node = {
        id: groupId,
        position: { x: bounds.x - 50, y: bounds.y - 50 },
        data: { label: "Group Node" },
        width: 380,
        height: 200,
        type: "labeledGroupNode",
      };

      const updatedNodes: Node[] = nodes.map((n) =>
        n.selected
          ? {
              ...n,
              parentId: groupId,
              extent: "parent",
              position: {
                x: n.position.x - (bounds.x - 50),
                y: n.position.y - (bounds.y - 50),
              },
            }
          : n
      );

      setNodes([groupNode, ...updatedNodes]);
    }, [nodes]);

    useImperativeHandle(ref, () => ({
      getRFInstance: () => rfInstance,
    }));

    return (
      <div
        className="wrapper"
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "100%" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          colorMode={colorMode}
          fitView
          fitViewOptions={{ padding: 2 }}
          nodeOrigin={nodeOrigin}
          onNodeClick={onNodeClick}
          onInit={setRfInstance}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={openDetail}
          onPaneClick={() => {
            setNodeSelected(undefined);
          }}
          proOptions={{ hideAttribution: true }}
          selectionOnDrag={true}
          {...restProps}
        >
          <Background />
          <Controls />
          {nodeSelected && (
            <Panel position="top-left">
              <div className="relative border-2 border-dashed border-gray-400 rounded-xl p-4 pt-6 max-w-md">
                <div className="absolute -top-3 left-4 px-2 text-sm font-medium dark:text-gray-300 bg-white dark:bg-gray-800">
                  Node Properties
                </div>

                <Input
                  label="Name"
                  type="text"
                  labelPlacement="outside"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onBlur={() => {
                    if (nodeSelected) {
                      updateNodeLabel(nodeSelected.id, labelInput);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && nodeSelected) {
                      updateNodeLabel(nodeSelected.id, labelInput);
                      // Nếu muốn mất focus sau khi Enter:
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            </Panel>
          )}
          <Panel position="top-right">
            <Button className="xy-theme__button mx-1" onPress={onSave}>
              Save Draff
            </Button>
            <Button className="xy-theme__button mx-1" onPress={onRestore}>
              Restore
            </Button>
            <Button className="xy-theme__button mx-1" onPress={onAdd}>
              Add Node
            </Button>
            <Button
              onPress={onGroupSelectedNodes}
              className="xy-theme__button mx-1"
            >
              Group Selected
            </Button>
          </Panel>
        </ReactFlow>
        <CDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent>
            {(onClose) => (
              <NodeDetail
                topicId={nodeSelected?.id}
                onClose={onClose}
              />
            )}
          </DrawerContent>
        </CDrawer>
      </div>
    );
  }
);

export default forwardRef<NodeFlowRef, NodeFlowProps>((props, ref) => {
  return (
    <ReactFlowProvider>
      <NodeFlow {...props} ref={ref} />
    </ReactFlowProvider>
  );
});
