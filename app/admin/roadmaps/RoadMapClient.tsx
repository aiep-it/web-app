"use client";
import { Tab, Tabs } from "@heroui/react";
import React from "react";

const RoadMapClient = () => {
    const [activeTab, setActiveTab] = React.useState('roadmap');
  return (
    <Tabs
      key={"secondary"}
      aria-label="Tabs colors"
      color={"secondary"}
      onSelectionChange={(key) => setActiveTab(key as string)}
      radius="full"
    >
      <Tab key="roadmap" title="RoadMap" >
        
      </Tab>
      <Tab key="category" title="Category" />
    </Tabs>
  );
};

export default RoadMapClient;
