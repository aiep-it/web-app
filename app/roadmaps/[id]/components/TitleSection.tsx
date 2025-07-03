"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  Progress,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { currentUser } from '@clerk/nextjs/server';

interface TitleSectionProps {
  title: string;
  subtitle: string;
  progress: {
    done: number;
    total: number;
    percentage: number;
  };
  selectedTab: string;
  setSelectedTab: (key: string) => void;
  faqContent: { title: string; content: string }[];
}

const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  subtitle,
  progress,
  selectedTab,
  setSelectedTab,
  faqContent
}) => {
  return (
    <div  className="min-h-4 bg-gradient-to-b from-cyan-200 to-white  dark:from-black dark:to-inherit text-foreground border-collapse rounded-md ">

  <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
    {/* Left - Brand */}
    <div className="flex items-center">
      <Link href="/" className="flex items-center text-foreground hover:underline">
        <Icon icon="lucide:arrow-left" className="mr-2" />
        All Roadmaps
      </Link>
    </div>

    {/* Right - Buttons */}
    <div className="flex items-center space-x-3">
      <button className="flex items-center gap-2 text-primary border border-primary rounded-md px-3 py-1 hover:bg-primary/10 transition">
        <Icon icon="lucide:calendar" />
        Schedule Learning Time
      </button>

      <button className="flex items-center gap-2 text-white bg-primary rounded-md px-3 py-1 hover:bg-primary/90 transition">
        <Icon icon="lucide:download" />
        Download
      </button>

      <button className="flex items-center gap-2 text-primary border border-primary rounded-md px-3 py-1 hover:bg-primary/10 transition">
        <Icon icon="lucide:share" />
        Share
      </button>
    </div>
  </div>



      <main className="container mx-auto px-0 py-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-xl text-gray-600 mb-6">{subtitle}</p>

        <Tabs
          aria-label="Roadmap options"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="roadmap" title="Roadmap" />
          <Tab key="projects" title="Projects" />
          <Tab
            key="ai-tutor"
            title={
              <div className="flex items-center">
                AI Tutor
                <span className="ml-2 px-1 py-0.5 text-xs bg-yellow-200 text-yellow-800  rounded">New</span>
              </div>
            }
          />
        </Tabs>

        <Card className="my-4 bg-cyan-200 dark:bg-cyan-950 dark:text-teal-200 ">
          <CardBody>
            <div className="flex justify-between items-center mb-2 ">
              <div >
                <span className="font-bold ">{progress.percentage}% DONE</span>
                <p className="text-sm ">
                  {progress.done} of {progress.total} Done
                </p>
              </div>
              <div>
                <Button color="primary" variant="ghost" size="sm" className="mr-2">
                  Share Progress
                </Button>
                <Button color="primary" variant="ghost" size="sm">
                  Track Progress
                </Button>
              </div>
            </div>
            <Progress
              aria-label="Learning progress"
              value={progress.percentage}
              className="bg-sky-300 dark:bg-cyan-800 "
              color="primary"
            />
          </CardBody>
        </Card>

        <Accordion>
          {faqContent.map((item, index) => (
            <AccordionItem key={index} aria-label={item.title} title={item.title}>
              <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, "<br>") }} />
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-right">
          <Link href="#" color="primary" size="sm">
            Suggest Changes
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TitleSection;
