"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Roadmap } from "@/services/types/roadmap"; 


interface PersonalManagementSectionProps {
  learningRoadmaps: Roadmap[];
}

const actionItems = [
  {
    icon: "lucide:help-circle",
    text: "Không có lộ trình tùy chỉnh?",
    action: "Tạo lộ trình tùy chỉnh",
    href: "/create-custom-roadmap",
  },
  {
    icon: "lucide:zap",
    text: "Muốn lộ trình tạo bởi AI?",
    action: "Tạo lộ trình AI",
    href: "/generate-ai-roadmap",
  },
  {
    icon: "lucide:plus-circle",
    text: "Sẵn sàng bắt đầu dự án mới?",
    action: "Bắt đầu dự án mới",
    href: "/start-new-project",
  },
];

const PersonalManagementSection: React.FC<PersonalManagementSectionProps> = ({
  learningRoadmaps,
}) => {
  const handleToggleBookmark = (id: string, isBookmarked: boolean) => {
    console.log(`Toggling bookmark for roadmap ID: ${id}, current state: ${isBookmarked}`);
    // TODO: Gọi API hoặc cập nhật trạng thái bookmark
  };

  const renderRoadmapCard = (roadmap: Roadmap) => (
    <Link href={`/roadmaps/${roadmap.id}`} key={roadmap.id} className="block">
      <div className="relative overflow-hidden p-4 min-h-[80px] flex flex-col justify-between cursor-pointer
        bg-white dark:bg-gray-800 rounded-lg shadow-md 
        text-gray-900 dark:text-white 
        border border-gray-200 dark:border-gray-700 
        transform transition-all hover:scale-[1.02] hover:shadow-xl hover:border-primary-500 
        hover:bg-gray-50 dark:hover:bg-gray-700 group">
        <div className="relative z-10 flex justify-between items-start w-full mb-3">
          <span className="font-semibold text-lg truncate pr-8 transition-colors">
            {roadmap.name}
          </span>
          <button
            className="flex-shrink-0 p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggleBookmark(roadmap.id, roadmap.isBookmarked || false);
            }}
            aria-label={roadmap.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Icon
              icon={roadmap.isBookmarked ? "lucide:bookmark" : "lucide:bookmark-plus"}
              className={`w-6 h-6 transition-colors duration-300 ${
                roadmap.isBookmarked
                  ? "text-primary-500 group-hover:text-primary-600"
                  : "text-gray-400 group-hover:text-primary-500"
              }`}
            />
          </button>
        </div>

        {roadmap.progressPercentage > 0 && (
          <div className="relative z-10 w-full mt-auto">
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-500 h-2.5 rounded-full shadow-sm"
                style={{ width: `${roadmap.progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-right mt-1 text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <span className="font-medium text-gray-800 dark:text-white">
                {roadmap.progressPercentage.toFixed(0)}%
              </span>{" "}
              Complete
            </p>
          </div>
        )}
      </div>
    </Link>
  );

  const renderActionItems = () =>
    actionItems.map((item, index) => (
      <div
        key={index}
        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          shadow-sm border border-gray-200 dark:border-gray-700
          transform transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <Icon icon={item.icon} className="text-primary-500 dark:text-primary-400 w-6 h-6 transition-colors" />
          <span className="font-medium transition-colors duration-300">{item.text}</span>
        </div>
        <Link href={item.href}>
          <Button variant="bordered">{item.action}</Button>
        </Link>
      </div>
    ));

  return (
    <div className="mb-8 rounded-xl shadow-xl text-gray-900 dark:text-white transition-colors">
      {learningRoadmaps.length > 0 ? (
        <>
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
            Your Progress
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {learningRoadmaps.map(renderRoadmapCard)}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-lg text-gray-700 dark:text-gray-300 transition-colors">
          Bạn chưa bắt đầu học lộ trình nào. Hãy chọn một lộ trình để bắt đầu!
        </div>
      )}

      <div className="space-y-4 pt-6 border-t border-gray-300 dark:border-gray-700 mt-6 transition-colors">
        {renderActionItems()}
      </div>
    </div>
  );
};

export default PersonalManagementSection;
