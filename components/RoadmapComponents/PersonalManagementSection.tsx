// web-app\components\RoadmapComponents\PersonalManagementSection.tsx
"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import Link from 'next/link'; // Import Link cho điều hướng

interface Roadmap {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  progressPercentage: number;
  is_deleted?: boolean;
}

interface PersonalManagementSectionProps {
  learningRoadmaps: Roadmap[];
}

const PersonalManagementSection: React.FC<PersonalManagementSectionProps> = ({ learningRoadmaps }) => {
  return (
    <div className="mb-8 p-4 bg-gray-900 rounded-lg shadow-md">
      {/* Tiêu đề cho các roadmap đang học */}
      {learningRoadmaps.length > 0 && (
        <h3 className="text-xl font-semibold mb-4 text-white">Your Progress</h3>
      )}

      {/* Hiển thị các roadmap đang học (có tiến độ > 0) hoặc đã bookmark*/}
      {learningRoadmaps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {learningRoadmaps.map((roadmap) => (
            <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} className="block"> {/* Điều hướng đến trang chi tiết roadmap */}
              <div
                className="relative bg-gray-700 rounded-md overflow-hidden h-16 px-4 flex items-center justify-between cursor-pointer hover:bg-gray-600 transition-colors"
              >
                {/* Thanh tiến độ */}
                <div
                  className="absolute left-0 top-0 h-full bg-primary-500 opacity-60 transition-all duration-500"
                  style={{ width: `${roadmap.progressPercentage}%` }}
                ></div>

                <div className="relative z-10 flex justify-between items-center w-full">
                  <span className="text-white font-medium truncate">{roadmap.name}</span>
                  <span className="text-white font-semibold">{roadmap.progressPercentage.toFixed(0)}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Hiển thị thông báo nếu không có roadmap nào đang học */}
      {learningRoadmaps.length === 0 && (
        <div className="text-white text-center py-4 text-lg">
          Bạn chưa bắt đầu học lộ trình nào. Hãy chọn một lộ trình để bắt đầu!
        </div>
      )}

      {/* Các nút hành động */}
      <div className="space-y-4 pt-4 border-t border-gray-700 mt-6"> {/* Thêm border top để phân cách */}
        {[
          {
            icon: "lucide:help-circle",
            text: "Không có lộ trình tùy chỉnh?",
            action: "Tạo lộ trình tùy chỉnh",
            href: "/create-custom-roadmap" // Đường dẫn giả định
          },
          {
            icon: "lucide:zap",
            text: "Muốn lộ trình tạo bởi AI?",
            action: "Tạo lộ trình AI",
            href: "/generate-ai-roadmap" // Đường dẫn giả định
          },
          {
            icon: "lucide:plus-circle",
            text: "Sẵn sàng bắt đầu dự án mới?",
            action: "Bắt đầu dự án mới",
            href: "/start-new-project" // Đường dẫn giả định
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2 md:mb-0"> {/* Tăng gap */}
              <Icon icon={item.icon} className="text-primary-400 text-xl" /> {/* Thay đổi màu và kích thước icon */}
              <span className="font-medium">{item.text}</span>
            </div>
            <Link href={item.href}>
                <Button size="md" variant="ghost" className="w-full md:w-auto border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"> {/* Cải thiện style nút */}
                {item.action}
                </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalManagementSection;
