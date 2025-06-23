"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const plans = [
  {
    name: "Free Plan",
    price: "₫0",
    period: "/tháng",
    features: [
      "Tính năng cơ bản cho cá nhân",
      "Không hỗ trợ tuỳ chỉnh",
      "Truy cập giới hạn dịch vụ cao cấp",
    ],
    ctaText: "Gói hiện tại",
    isActive: true,
    isFree: true,
  },
  {
    name: "Gói Tháng",
    price: "₫79,000",
    period: "/tháng",
    features: [
      "Không giới hạn giao dịch",
      "Hỗ trợ khách hàng ưu tiên",
      "Ưu đãi và quà tặng hàng tháng",
    ],
    ctaText: "Nâng cấp",
    isActive: false,
  },
  {
    name: "Gói Năm",
    price: "₫699,000",
    period: "/năm",
    features: [
      "Bao gồm gói tháng",
      "Tặng 2 tháng miễn phí",
      "Anh làm bố em mẹ luôn",
    ],
    ctaText: "Nâng cấp",
    isActive: false,
    isBestValue: true,
  },
  {
    name: "Gói Doanh Nghiệp",
    price: "Liên hệ",
    period: "",
    features: [
      "Tất cả tính năng nâng cao",
      "Dashboard cho doanh nghiệp",
      "Tổng đài hỗ trợ riêng",
      "Tích hợp API theo yêu cầu",
    ],
    ctaText: "Liên hệ",
    isActive: false,
  },
];

const PricingPlans: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Bạn đang sử dụng gói <span className="text-[#ec008c]">Free</span>
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`overflow-visible ${
                plan.isBestValue ? "border-[#ec008c] border-2" : ""
              }`}
              shadow="md"
            >
              <CardHeader className="flex flex-col items-start gap-2 pb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {plan.name}
                </h2>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    {plan.period}
                  </span>
                </div>
                {plan.isBestValue && (
                  <Chip
                    color="primary"
                    variant="flat"
                    className="absolute top-0 right-0 mt-2 mr-2"
                  >
                    Best Value
                  </Chip>
                )}
              </CardHeader>
              <CardBody className="py-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Icon
                        icon="lucide:check"
                        className="h-6 w-6 text-[#ec008c] flex-shrink-0"
                      />
                      <span className="ml-3 text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                <Button
                  color={plan.isActive ? "default" : "primary"}
                  variant={plan.isActive ? "flat" : "solid"}
                  className="w-full"
                  disabled={plan.isActive}
                >
                  {plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
