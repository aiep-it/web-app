import { Roadmap } from "./roadmap";

export type NodePayload = {
  id?: string;
  roadmapId: string;
  title: string;
  description?: string;
};


export type NodeData = {
    id: string;
    roadmap: Roadmap;
    title: string;
    description: string;
  };
  