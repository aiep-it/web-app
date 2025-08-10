"use client";
import React from "react";
import FormTopicEdit from "./components/FormTopicEdit";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TopicEditPageProps {
  id: string;
}
const TopicEditPage: React.FC<TopicEditPageProps> = ({ id }) => {
  return (
    <div className="bg-background flex items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:book-open" className="text-primary text-2xl" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Edit Topic</p>
            <p className="text-small text-default-500">
              Fill in the details to edit your topic
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <FormTopicEdit topicId={id} />
        </CardBody>
      </Card>
    </div>
  );
};

export default TopicEditPage;
