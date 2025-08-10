// 📁 components/cards/BaseCard.tsx
"use client";

import { Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { CustomButton } from "@/shared/components/button/CustomButton";

interface BaseCardProps {
  id: string;
  name: string;
  description?: string;
  onDelete: (id: string) => void;
  editUrl: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  id,
  name,
  description,
  onDelete,
  editUrl,
}) => {
  const router = useRouter();

  return (
    <Card
      as={"div"}
      className="rounded-xl p-5 shadow-lg flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300 cursor-pointer
      bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
      text-white"
      isPressable
      onPress={() => {
        router.push(`/admin/roadmaps/${id}`); // Navigate to the roadmap details page
      }}
    >
      <div>
        <h3 className="text-xl font-bold mb-1 text-white">{name}</h3>
        <p className="text-sm text-white/90 mb-2">{description}</p>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <CustomButton
          size="sm"
          preset="ghost"
          icon="lucide:edit"
          iconSize={14}
          onPress={() => {
            router.push(editUrl);
          }}
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-200"
        >
          Edit
        </CustomButton>
        <CustomButton
          size="sm"
          preset="ghost"
          icon="lucide:trash-2"
          iconSize={14}
          onPress={() => onDelete(id)}
          className="bg-red-500/20 backdrop-blur-sm text-white border border-red-300/30 hover:bg-red-500/40 hover:border-red-300/50 transition-all duration-200"
        >
          Delete
        </CustomButton>
      </div>
    </Card>
  );
};

export default BaseCard;
