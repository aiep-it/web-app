"use client";

import React from "react";
import TitleSection from "./components/TitleSection";

const RoadmapPage = () => {
  const [selectedTab, setSelectedTab] = React.useState("roadmap");

  const roadmapData = {
    title: "Frontend Developer",
    subtitle: "Step by step guide to becoming a modern frontend developer in 2025",
    progress: {
      done: 9,
      total: 115,
      percentage: 15
    },
    content: [
      {
        title: "What is a Frontend Developer?",
        content: `A frontend developer is a professional who uses HTML, CSS, and JavaScript...

What is the role of a Frontend Developer?
You'll be responsible for creating the user interface...

Which languages are used for Frontend Development?
HTML, CSS, and JavaScript are the main languages...`
      }
    ]
  };

  return (
    <TitleSection
      title={roadmapData.title}
      subtitle={roadmapData.subtitle}
      progress={roadmapData.progress}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      faqContent={roadmapData.content}
    />
  );
};

export default RoadmapPage;
