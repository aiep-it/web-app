// components/cards/BaseCard.tsx
"use client";

import { Card } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { CustomButton } from "@/shared/components/button/CustomButton";
import ButtonConfirm from "@/components/ButtonConfirm";

interface BaseCardProps {
  id: string;
  name: string;
  description?: string;
  onDelete: (id: string) => void;
  editUrl: string;
  viewUrl: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  id, name, description, onDelete, editUrl, viewUrl,
}) => {
  const router = useRouter();

  return (
    <Card
      as="div"
      className="rounded-xl p-5 shadow-lg flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300
                 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
    >
      {/* Vùng click để xem chi tiết (Link riêng) */}
      <Link
        href={viewUrl}
        className="block"
      >
        <h3 className="text-xl font-bold mb-1 text-white">{name}</h3>
        <p className="text-sm text-white/90 mb-2">{description}</p>
      </Link>

      {/* Thanh action: KHÔNG nằm trong Link */}
      <div
        className="flex justify-end gap-2 pt-4"
        // đảm bảo click ở đây không lan lên vùng trên (nếu có handler)
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <CustomButton
          size="md"
          preset="ghost"
          icon="lucide:edit"
          iconSize={14}
          // dùng onClick (DOM MouseEvent) để có preventDefault nếu cần
          onClick={(e) => {
            e.preventDefault();
            router.push(editUrl);
          }}
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-200"
        >
          Edit
        </CustomButton>

        {/* ButtonConfirm thường mở modal/portal -> tách khỏi Link là cách an toàn nhất */}
        <span
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <ButtonConfirm
            size="md"
            title="Xoá danh mục?"
            message={`Bạn chắc chắn muốn xoá "${name}"? Hành động này không thể hoàn tác.`}
            saveButtonText="Xoá"
            cancelButtonText="Huỷ"
            color="danger"
            variant="flat"
            onSave={async () => {
              await onDelete(id);
            }}
            className="bg-red-500/20 backdrop-blur-sm text-white border border-red-300/30 hover:bg-red-500/40 hover:border-red-300/50 transition-all duration-200"
          >
            Delete
          </ButtonConfirm>
        </span>
      </div>
    </Card>
  );
};

export default BaseCard;
