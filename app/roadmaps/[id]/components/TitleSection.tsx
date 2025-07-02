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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar maxWidth="xl" isBordered>
        <NavbarContent justify="start">
          <NavbarBrand>
            <Link href="/roadmaps" color="foreground">
              <Icon icon="lucide:arrow-left" className="mr-2" />
              All Roadmaps
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="primary" variant="flat" startContent={<Icon icon="lucide:calendar" />}>
              Schedule Learning Time
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" startContent={<Icon icon="lucide:download" />}>
              Download
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" variant="flat" startContent={<Icon icon="lucide:share" />}>
              Share
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
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

        <Card className="my-6 bg-cyan-200 dark:bg-cyan-950 dark:text-teal-200">
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
