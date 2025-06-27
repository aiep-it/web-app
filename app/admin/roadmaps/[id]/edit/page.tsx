"use client"; 

import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip"; 
import { Icon } from "@iconify/react";
// import { RoadmapNode } from "./components/roadmap-node"; 
import { Link } from '@heroui/react';

export default function RoadmapPage() { 
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set(["1"]));
  const [selectedRoadmap, setSelectedRoadmap] = React.useState("frontend");

  // Dữ liệu cho các lộ trình học tập
  const roadmaps = {
    frontend: {
      id: "frontend",
      name: "Frontend Development Roadmap",
      nodes: [
        {
          id: "1",
          title: "HTML Fundamentals",
          progress: 75,
          items: [
            {
              type: "document",
              title: "HTML5 Structure Guide",
              description: "Learn the basic structure of HTML5 documents",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "HTML Tags Glossary",
              description: "Common HTML tags and their usage",
              link: "#",
              completed: true
            },
            {
              type: "video",
              title: "Semantic HTML Introduction",
              description: "Understanding semantic elements in HTML5",
              link: "#",
              completed: false
            }
          ]
        },
        {
          id: "2",
          title: "CSS Styling",
          progress: 50,
          items: [
            {
              type: "document",
              title: "CSS Selectors Reference",
              description: "Comprehensive guide to CSS selectors",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "CSS Properties Dictionary",
              description: "Common CSS properties and values",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "Flexbox Layout Tutorial",
              description: "Master flexible box layouts in CSS",
              link: "#",
              completed: true
            }
          ]
        },
        {
          id: "3",
          title: "JavaScript Basics",
          progress: 25,
          items: [
            {
              type: "document",
              title: "JavaScript Syntax Guide",
              description: "Core syntax and language features",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "JavaScript Terminology",
              description: "Essential terms and concepts in JavaScript",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "DOM Manipulation Basics",
              description: "Learn to interact with the Document Object Model",
              link: "#",
              completed: false
            }
          ]
        },
        {
          id: "4",
          title: "React Framework",
          progress: 10,
          items: [
            {
              type: "document",
              title: "React Component Patterns",
              description: "Best practices for React components",
              link: "#",
              completed: false
            },
            {
              type: "vocab",
              title: "React Ecosystem Terms",
              description: "Common terminology in the React world",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "Hooks Deep Dive",
              description: "Understanding React hooks in depth",
              link: "#",
              completed: false
            }
          ]
        }
      ]
    },
    backend: {
      id: "backend",
      name: "Backend Development Roadmap",
      nodes: [
        {
          id: "1",
          title: "Node.js Fundamentals",
          progress: 60,
          items: [
            {
              type: "document",
              title: "Node.js Architecture",
              description: "Understanding the event-driven architecture",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "Node.js Terminology",
              description: "Essential terms in Node.js development",
              link: "#",
              completed: true
            },
            {
              type: "video",
              title: "Async Programming in Node",
              description: "Working with promises and async/await",
              link: "#",
              completed: false
            }
          ]
        },
        {
          id: "2",
          title: "Express Framework",
          progress: 40,
          items: [
            {
              type: "document",
              title: "Express Routing Guide",
              description: "Creating and managing routes in Express",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "Express Middleware Glossary",
              description: "Common middleware and their functions",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "RESTful API Design",
              description: "Building REST APIs with Express",
              link: "#",
              completed: false
            }
          ]
        },
        {
          id: "3",
          title: "Database Integration",
          progress: 30,
          items: [
            {
              type: "document",
              title: "MongoDB Basics",
              description: "Working with NoSQL databases",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "SQL vs NoSQL Terms",
              description: "Comparing database terminology",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "Mongoose ORM Tutorial",
              description: "Object modeling with Mongoose",
              link: "#",
              completed: false
            }
          ]
        }
      ]
    },
    devops: {
      id: "devops",
      name: "DevOps Engineering Roadmap",
      nodes: [
        {
          id: "1",
          title: "CI/CD Pipelines",
          progress: 45,
          items: [
            {
              type: "document",
              title: "Jenkins Configuration",
              description: "Setting up automated build pipelines",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "CI/CD Terminology",
              description: "Common terms in continuous integration",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "GitHub Actions Tutorial",
              description: "Automating workflows with GitHub",
              link: "#",
              completed: false
            }
          ]
        },
        {
          id: "2",
          title: "Container Orchestration",
          progress: 35,
          items: [
            {
              type: "document",
              title: "Kubernetes Basics",
              description: "Managing containerized applications",
              link: "#",
              completed: true
            },
            {
              type: "vocab",
              title: "Container Terminology",
              description: "Essential Docker and K8s terms",
              link: "#",
              completed: false
            },
            {
              type: "video",
              title: "Docker Compose Tutorial",
              description: "Multi-container applications",
              link: "#",
              completed: false
            }
          ]
        }
      ]
    }
  };

  // Lấy dữ liệu lộ trình hiện tại dựa trên lựa chọn
  const currentRoadmap = roadmaps[selectedRoadmap as keyof typeof roadmaps];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <Card className="max-w-5xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Learning Roadmaps</h1>
              <p className="text-foreground-500 mt-1">Track your progress across multiple learning paths</p>
            </div>
            <div className="flex gap-2">
            
              <Link href="/admin/nodes">
                      <Button color="primary" startContent={<Icon icon="lucide:plus" />} >
                Add Node
              </Button>
                      </Link>
              <Button variant="flat" startContent={<Icon icon="lucide:plus-circle" />}>
                New Roadmap
              </Button>
            </div>
          </div>

          <Tabs
            aria-label="Roadmaps"
            selectedKey={selectedRoadmap}
            onSelectionChange={setSelectedRoadmap as any}
            className="mb-6"
            color="primary"
            variant="underlined"
          >
            <Tab key="frontend" title="Frontend Development" />
            <Tab key="backend" title="Backend Development" />
            <Tab key="devops" title="DevOps Engineering" />
          </Tabs>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">{currentRoadmap.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Icon icon="lucide:map" className="text-foreground-500" />
              <span className="text-sm text-foreground-500">
                {currentRoadmap.nodes.length} learning nodes
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <Accordion
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys as any}
              variant="splitted"
              className="gap-4"
            >
              {currentRoadmap.nodes.map((node) => (
                <AccordionItem
                  key={node.id}
                  aria-label={node.title}
                  title={
                    <div className="flex items-center justify-between w-full pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{node.title}</span>
                        <Chip color={getProgressColor(node.progress)} variant="flat" size="sm">
                          {node.progress}% Complete
                        </Chip>
                      </div>
                    </div>
                  }
                  classNames={{
                    title: "text-base",
                    content: "pt-0"
                  }}
                >
                  {/* <RoadmapNode items={node.items} /> */}
                  <div>cc</div> {/* Thay thế bằng component RoadmapNode thực tế nếu có */}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hàm trợ giúp để xác định màu sắc dựa trên tiến độ
function getProgressColor(progress: number): "success" | "warning" | "danger" | "primary" {
  if (progress >= 75) return "success";
  if (progress >= 50) return "warning";
  if (progress >= 25) return "primary";
  return "danger";
}
