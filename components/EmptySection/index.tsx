import { Button } from '@heroui/react';
import { useRouter } from 'next/router';
import React from 'react';

interface EmptySectionProps {
    message?: string;
}
const EmptySection = ({
    message = "Không Tồn Tại Các Chủ Đề",
}) => {
  return (
    <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-default-200 bg-default-50">
      <p className="text-default-500">{message}</p>
    
    </div>
  );
};

export default EmptySection;
