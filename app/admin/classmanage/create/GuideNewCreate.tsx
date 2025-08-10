"use client";
import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

const GuideNewClass = () => {
  return (
    <Card shadow="sm" className="border border-divider">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="lucide:info" className="text-primary text-xl" />
          <h2 className="text-xl font-semibold">
            Guilde to create a new class
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
                  <span className="font-medium">Class Name: </span>
                    Sample name of the class: FY-301
                </li>
                <li>
                  <span className="font-medium">Class Code: </span>
                    Unique code for the class, used for enrollment and identification.
                </li>
                <li>
                  <span className="font-medium">Description: </span>
                    Overview about class, what it is about, and what skills it covers.
                </li>
                <li>
                  <span className="font-medium">Level: STARTERS | MOVERS | FLYERS </span>
                    Indicates the difficulty level of the class.
                </li>
                <li>
                  <span className="font-medium">Teachers</span>
                    List of teachers for the class. You can add multiple teachers.
                </li>
                <li>
                  <span className="font-medium">Roadmaps</span>
                    Assign one or more roadmaps to the class to guide the curriculum.
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
                <span className="font-medium">Add students into class</span>
              </div>
            }
          >
            <div className="text-default-600 px-8 py-2">
              <p>In Class Add List students</p>
            </div>
          </AccordionItem>

          <AccordionItem
            key="3"
            title={
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <span className="font-medium">Active Class</span>
              </div>
            }
          >
            <div className="text-default-600 space-y-2 px-8 py-2">
              <p>Wait Admin Apporve Class Will Active</p>
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
                You can draft your class and come back later to complete it.
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default GuideNewClass;
