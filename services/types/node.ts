import { Edge, Node, Viewport } from "@xyflow/react";
import { Roadmap } from "./roadmap";

export type NodePayload = {
  id?: string;
  roadmapId?: string;
  title: string;
  description?: string;
};

export type NodeData = {
  id: string;
  roadmap: Roadmap;
  title: string;
  description: string;
};
export type NodeUpdatePayload = {
    title?: string;
    description?: string;
    coverImage?: string;
    suggestionLevel?: string;
}

export type NodeViewCMS = {
    roadmapId: string;
    edges: Edge[];
    nodes: Node[];
    viewport: Viewport;
}