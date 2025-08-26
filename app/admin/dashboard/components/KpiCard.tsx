"use client";

import React, { Component } from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

type KpiCardProps = {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  /** chọn tông màu điểm nhấn */
  accent?: "blue" | "green" | "purple" | "orange";
};

class KpiCard extends Component<KpiCardProps> {
  static defaultProps = {
    accent: "blue",
  };

  getAccentClasses(accent: NonNullable<KpiCardProps["accent"]>) {
    const map = {
      blue: {
        label: "text-blue-600",
        value: "text-blue-700",
        iconBg: "bg-blue-100",
        icon: "text-blue-600",
      },
      green: {
        label: "text-green-600",
        value: "text-green-700",
        iconBg: "bg-green-100",
        icon: "text-green-600",
      },
      purple: {
        label: "text-purple-600",
        value: "text-purple-700",
        iconBg: "bg-purple-100",
        icon: "text-purple-600",
      },
      orange: {
        label: "text-orange-600",
        value: "text-orange-700",
        iconBg: "bg-orange-100",
        icon: "text-orange-600",
      },
    } as const;
    return map[accent];
  }

  render() {
    const { icon, label, value, sub, accent = "blue" } = this.props;
    const ac = this.getAccentClasses(accent);

    return (
      <Card className="rounded-2xl shadow-md border border-default-200">
        <CardBody className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${ac.label}`}>{label}</p>
              <p className={`text-3xl font-semibold mt-1 ${ac.value}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${ac.iconBg}`}>
              <Icon icon={icon} className={`text-2xl ${ac.icon}`} />
            </div>
          </div>
          {sub ? <p className="text-xs text-default-500">{sub}</p> : null}
        </CardBody>
      </Card>
    );
  }
}

export default KpiCard;
