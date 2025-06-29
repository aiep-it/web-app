"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";

interface NodeDetailProps {
  id: string;
}
const NodeDetail: React.FC<NodeDetailProps> = ({ id }) => {
    const [activeTab, setActiveTab] = React.useState('roadmap');
    return (
      <Tabs
        key={"secondary"}
        aria-label="Tabs colors"
        color={"secondary"}
        onSelectionChange={(key) => setActiveTab(key as string)}
        radius="full"
      >
        <Tab key="info" title="Node Information" >
          
        </Tab>
        <Tab key="vocab" title="Vocab" />
      </Tabs>
    );
};

export default NodeDetail;
