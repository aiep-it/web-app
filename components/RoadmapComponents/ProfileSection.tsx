// web-app\components\RoadmapComponents\ProfileSection.tsx
"use client"; // Đánh dấu đây là Client Component

import React, { useState, useEffect } from 'react';
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useAuth } from '@clerk/nextjs'; // Import useAuth để lấy userId và token


interface UserMetrics {
  streak: number;
  learntToday: number;
  projectsFinished: number;
}

const ProfileSection: React.FC = () => {
  const { userId, getToken } = useAuth(); // Lấy userId và hàm getToken
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      if (!userId) { // Nếu user chưa đăng nhập, không fetch
        setLoading(false);
        setMetrics({ streak: 0, learntToday: 0, projectsFinished: 0 }); // Giá trị mặc định
        return;
      }

      setLoading(true);
      setError(null);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

      try {
        const token = await getToken(); // Lấy token Clerk
        const res = await fetch(`${backendUrl}/users/me/metrics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch user metrics');
        }

        const data: UserMetrics = await res.json();
        setMetrics(data);
      } catch (err: any) {
        console.error('Error fetching user metrics:', err);
        setError(err.message || 'Error loading metrics.');
        setMetrics({ streak: 0, learntToday: 0, projectsFinished: 0 }); // Đặt lại mặc định khi lỗi
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [userId, getToken]); 

  const metricItems = [
    { icon: "lucide:zap", text: metrics ? `${metrics.streak} day streak` : "Loading..." },
    { icon: "lucide:book-open", text: metrics ? `${metrics.learntToday} learnt today` : "Loading..." },
    { icon: "lucide:check-circle", text: metrics ? `${metrics.projectsFinished} projects finished` : "Loading..." }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-gray-900 rounded-lg shadow-md">
      {/* Nút "Set up your profile" */}
      <Button color="primary" size="lg" className="mb-4 md:mb-0">
        Set up your profile
      </Button>

      {/* Các chỉ số theo dõi học tập */}
      <div className="flex flex-col md:flex-row gap-4">
        {loading ? (
          <div className="text-white">Loading metrics...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          metricItems.map((metric, index) => (
            <Card key={index} className="p-3 bg-gray-800 text-white rounded-md">
              <div className="flex items-center gap-2">
                <Icon icon={metric.icon} className="text-primary-500" />
                <span>{metric.text}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfileSection;
