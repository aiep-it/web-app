"use client";
import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

const GuideNewRoadMap = () => {
  return (
    <Card shadow="sm" className="border border-divider">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="lucide:info" className="text-primary text-xl" />
          <h2 className="text-xl font-semibold">
            Guilde to create a new roadmap
          </h2>
        </div>

        <Accordion
          variant="splitted"
          selectionMode="multiple"
          defaultSelectedKeys={["1"]}
        >
          <AccordionItem
            key="1"
            title={
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  1
                </div>
                <span className="font-medium">Input basic information</span>
              </div>
            }
          >
            <div className="text-default-600 space-y-2 px-8 py-2">
              <p>Information guide</p>
              <ul className="space-y-1 list-disc pl-5 text-default-500">
                <li>
                  <span className="font-medium">Name: </span>
                  Sample name of the roadmap: FE Develop
                </li>
                <li>
                  <span className="font-medium">Desctiption: </span>
                  Overview about roadmap, what it is about, and what skills it
                </li>
              </ul>
            </div>
          </AccordionItem>

          <AccordionItem
            key="2"
            title={
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <span className="font-medium">Create Nodes for RoadMap</span>
              </div>
            }
          >
            <div className="text-default-600 px-8 py-2">
              <p>Create Flow Nodes for RoadMap</p>
            </div>
          </AccordionItem>

          <AccordionItem
            key="3"
            title={
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <span className="font-medium">Create content for roadmap</span>
              </div>
            }
          >
            <div className="text-default-600 space-y-2 px-8 py-2">
              <p>Create content for roadmap</p>
            </div>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
          <div className="flex gap-3">
            <div className="text-primary">
              <Icon icon="lucide:lightbulb" className="text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-primary-700">Hint</h3>
              <p className="text-sm text-primary-600 mt-1">
                You can draff your roadmap and come back later to complete it.
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default GuideNewRoadMap;
