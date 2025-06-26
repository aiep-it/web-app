// 📁 components/cards/BaseCard.tsx
"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface BaseCardProps {
  id: string;
  name: string;
  description?: string;
  onDelete: (id: string) => void;
  editUrl: string;
}

const BaseCard: React.FC<BaseCardProps> = ({ id, name, description, onDelete, editUrl }) => {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div>
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-white/80 mb-2">{description}</p>
        
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          size="sm"
          onClick={() => router.push(editUrl)}
          className="bg-white text-indigo-700 hover:bg-gray-100"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(id)}
          className="border border-white hover:bg-white/10"
        >
          Del
        </Button>
      </div>
    </div>
  );
};

export default BaseCard;
