"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface ExerciseImageProps {
  imageUrl: string;
  alt?: string;
}

export const ExerciseImage: React.FC<ExerciseImageProps> = ({
  imageUrl,
  alt = "Exercise context"
}) => {
  return (
    <div className="xl:col-span-2 order-2 xl:order-1">
      <div className="relative group">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
          <img 
            src={imageUrl} 
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Icon icon="mdi:image-outline" className="text-blue-500" />
              Visual context
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
