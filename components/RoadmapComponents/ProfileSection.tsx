"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useAuth } from "@clerk/nextjs";

import { UserMetrics } from "@/services/types/user";
import { getUserMetrics } from "@/services/user";

const ProfileSection: React.FC = () => {
  const { userId, getToken,  } = useAuth();
  
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!userId) {
        setMetrics({ streak: 0, learntToday: 0, projectsFinished: 0 });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error("Missing token");
        const data = await getUserMetrics(token);
        setMetrics(data);
      } catch (err: any) {
        console.error("Error fetching metrics:", err);
        setError(err.message || "Failed to load metrics");
        setMetrics({ streak: 0, learntToday: 0, projectsFinished: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId, getToken]);

  const renderMetricItems = () => {
    if (!metrics) return [];

    return [
      {
        icon: "lucide:zap",
        text: `${metrics.streak} day streak`,
      },
      {
        icon: "lucide:book-open",
        text: `${metrics.learntToday} learnt today`,
      },
      {
        icon: "lucide:check-circle",
        text: `${metrics.projectsFinished} projects finished`,
      },
    ];
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 rounded-lg shadow-md">
      {/* Profile button */}
      <Button color="primary" size="lg" className="mb-4 md:mb-0">
        Set up your profile
      </Button>

      {/* Metrics display */}
      <div className="flex flex-col md:flex-row gap-4">
        {loading ? (
          <div className="text-white">Loading metrics...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          renderMetricItems().map((metric, index) => (
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
};

export default ProfileSection;
