// 📁 components/cards/BaseCard.tsx
"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

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
      className="rounded-xl p-5 shadow-lg flex flex-col justify-between h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer
      bg-gradient-to-r from-primary-100 to-secondary-100
      dark:from-primary-100 dark:to-secondary-100 dark:text-white
      text-gray-900"
      isPressable
      onPress={() => {
        router.push(`/admin/roadmaps/${id}`); // Navigate to the roadmap details page
      }}
    >
      <div>
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-white/80 mb-2">{description}</p>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          size="sm"
          onPress={() => {
            router.push(editUrl);
          }}
          color="primary"
          variant="bordered"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          color="danger"
          onPress={() => onDelete(id)}
        >
          Del
        </Button>
      </div>
    </Card>
  );
};

export default BaseCard;
