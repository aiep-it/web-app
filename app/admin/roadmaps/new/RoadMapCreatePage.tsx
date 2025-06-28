"use client";

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import FormNewRoadMap from "./component/FormNewRoadMap";
import GuideNewRoadMap from "./component/GuideNewRoadMap";

const RoadMapCreatePage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Create New Roadmap
        </h1>
        <p className="text-default-500 mt-2">
          Create a new roadmap to guide your learning skill. Fill in the details
          below to get started.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:flex-1">
          <GuideNewRoadMap />
        </div>

        <div className="lg:flex-1">
          <Card shadow="sm" className="border border-divider">
            <CardHeader className="flex gap-3">
              <Icon icon="lucide:book-open" className="text-primary text-2xl" />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Create a New Road Map</p>
                <p className="text-small text-default-500">
                  Fill in the details to create your Road Map
                </p>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <FormNewRoadMap />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoadMapCreatePage;
