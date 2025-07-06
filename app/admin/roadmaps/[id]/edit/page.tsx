"use client";
import React, { useRef } from "react";
import "@xyflow/react/dist/style.css";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Node } from "@xyflow/react";
import ButtonConfirm from "@/components/ButtonConfirm";
import NodeFlow, { NodeFlowRef } from "../components/NodeFlow";


const AdminNodePage = () => {
  const nodeFlowRef = useRef<NodeFlowRef>(null);

  const onPublisher = () => {
    const formRef = nodeFlowRef.current;

    const instance = formRef?.getRFInstance();

    instance?.toObject();
  };

  return (
    <div className="flex justify-center items-center h-full mt-auto">
      <Card className="w-full h-full">
        <CardHeader className=" flex justify-between">
          <div className="p-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Learning Roadmaps
                </h1>
                <p className="text-foreground-500 mt-1">
                  Track your progress across multiple learning paths
                </p>
              </div>
            </div>
          </div>
          <div>
            <Tooltip content="Public" className="capitalize" color="primary">
              <ButtonConfirm
                endContent={<Icon icon="lucide:send-horizontal" />}
                color="primary"
                onSave={onPublisher}
                saveButtonText="Publisher"
                disabled={false}
              />
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody>
          <NodeFlow ref={nodeFlowRef}/>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminNodePage;
