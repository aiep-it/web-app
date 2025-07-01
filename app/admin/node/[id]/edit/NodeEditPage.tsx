"use client";
import React from "react";
import FormNodeEdit from "./components/FormNodeEdit";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NodeEditPageProps {
  id: string;
}
const NodeEditPage: React.FC<NodeEditPageProps> = ({ id }) => {
  return (
    <div className="bg-background flex items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:book-open" className="text-primary text-2xl" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Edit Node</p>
            <p className="text-small text-default-500">
              Fill in the details to create your Node
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <FormNodeEdit nodeId={id} />
        </CardBody>
      </Card>
    </div>
  );
};

export default NodeEditPage;
