import { memo } from "react";

import { Handle, NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "@/components/BaseNode";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";

const NodeHeader = memo(({ selected, id, data }: NodeProps) => {

  return (
    <BaseNode selected={selected}>
      <Card className="max-w-[340px]">
        <CardHeader className="justify-between">
          <div className="flex gap-5"></div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>
            Frontend developer and UI/UX enthusiast. Join me on this coding
            adventure!
          </p>
          <span className="pt-2">
            #FrontendWithZoey
            <span aria-label="computer" className="py-2" role="img">
              💻
            </span>
          </span>
        </CardBody>
        <CardFooter className="gap-3">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">4</p>
            <p className=" text-default-400 text-small">Following</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">97.1K</p>
            <p className="text-default-400 text-small">Followers</p>
          </div>
        </CardFooter>
      </Card>

      {/* Optional handles for connecting */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
});

export default NodeHeader;
