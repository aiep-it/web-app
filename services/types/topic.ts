import { Edge, Node, Viewport } from '@xyflow/react';
import { Roadmap } from './roadmap';
import { TopicStatus } from '@/constant/enums';

export type TopicPayload = {
  id?: string;
  roadmapId?: string;
  title: string;
  description?: string;
};

export type TopicData = {
  id: string;
  roadmap: Roadmap;
  title: string;
  description: string;
  coverImage?: string;
  suggestionLevel?: string;
  updated_at?: Date;
  created_at?: Date;
  status?: TopicStatus;
};
export type TopicUpdatePayload = {
  title?: string;
  description?: string;
  coverImage?: string;
  suggestionLevel?: string;
  isMyWorkspace?: boolean;
};

export type NodeViewCMS = {
  roadmapId: string;
  edges: Edge[];
  nodes: Node[];
  viewport: Viewport;
};
