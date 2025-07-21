
import { TopicContentCMS } from "@/app/admin/topic/[id]/edit/types";
import { COLLECTIONS } from "@/config/cms";
import { getItems } from "@/services/cms";
import { getTopicId } from "@/services/topic";
import { TopicData } from "@/services/types/topic";
import { NodeContent } from "@/types/Node";
import { getFullPathFile } from "@/utils/expections";
import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Image,
  Link,
  PressEvent,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import React from "react";

interface TopicDetailProps {
  topicId?: string;
  onClose?: (e: PressEvent) => void;
  viewOnly?: boolean;
}

const NodeDetail: React.FC<TopicDetailProps> = ({
  topicId,
  onClose,
  viewOnly = false,
}: TopicDetailProps) => {
  const [topic, setTopic] = React.useState<TopicData | null>(null);
  const [nodeContentCMS, setNodeContentCMS] = React.useState<TopicContentCMS | null>(null);

  React.useEffect(() => {
    if (topicId) {
      const loadData = async () => {
        if (!topicId) return;

        const [topicData, contentRes] = await Promise.all([
          getTopicId(topicId),
          getItems<TopicContentCMS>(COLLECTIONS.NodeContent, {
            filter: { nodeId: { _eq: topicId } },
          }),

          
        ]);

        if(topicData) {
          setTopic(topicData);
          if (contentRes && contentRes.length) {
            const cmsContent = contentRes[0];
            setNodeContentCMS(cmsContent);
          }
        }
      }

      loadData();
    }
  }, [topicId]);

  const router = useRouter();
  return (
    <>
      <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
        <Tooltip content="Close">
          <Button
            isIconOnly
            className="text-default-400"
            size="sm"
            variant="light"
            onPress={onClose}
          >
            <svg
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
            </svg>
          </Button>
        </Tooltip>
        <div className="w-full flex justify-start gap-2">
          <Button
            className="font-medium text-small text-default-500"
            size="sm"
            startContent={
              <svg
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            }
            variant="flat"
          >
            Copy Link
          </Button>
          <Button
            className="font-medium text-small"
            color="secondary"
            endContent={
              <Icon
                icon="lucide:pencil-line"
                width={16}
                height={16}
              />
            }
            size="sm"
            // variant='bordered'
            onPress={() => {
              if (topic?.id && topicId) {
                router.push(`/admin/node/${topic.id}/edit`);
              }
            }}
          >
            Edit Node
          </Button>
        </div>
        <div className="flex gap-1 items-center">
          <Tooltip content="Previous">
            <Button
              isIconOnly
              className="text-default-500"
              size="sm"
              variant="flat"
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip content="Next">
            <Button
              isIconOnly
              className="text-default-500"
              size="sm"
              variant="flat"
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          </Tooltip>
        </div>
      </DrawerHeader>
      <DrawerBody className="pt-16">
        {topicId && topic ? (
          <>
            <div className="flex w-full justify-center items-center pt-4">
              <Image
                isBlurred
                isZoomed
                alt="Event image"
                className="aspect-square w-full hover:scale-110"
                height={300}
                src={topic.coverImage ? getFullPathFile(topic.coverImage) : "https://placehold.co/600x400"}
              />
            </div>
            <div className="flex flex-col gap-2 py-4">
              <h1 className="text-2xl font-bold leading-7">{topic?.title}</h1>
              <p className="text-sm text-default-500">{topic.description}</p>
              {
                topic.suggestionLevel &&  <Chip color="secondary">{topic.suggestionLevel}</Chip>
              }
             
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-col mt-4 gap-3 items-start">
                  <span className="text-medium font-medium">Content</span>
                  <div className="text-medium text-default-500 flex flex-col gap-2">
                    {
                       nodeContentCMS?.content ? (
                        <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: nodeContentCMS?.content || "" }}
                      />
                       ) : (
                        <p className="text-default-500">
                          No Content to show
                        </p>
                       )
                    }
                
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-default-200 bg-default-50">
            <p className="text-default-500">
              Your Node is not found, need to save node and view or update
              content later
            </p>
          </div>
        )}
      </DrawerBody>
      <DrawerFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" onPress={onClose}>
          Action
        </Button>
      </DrawerFooter>
    </>
  );
};

export default NodeDetail;
