'use client';
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function StaffHome() {
  return (
    <div className="flex justify-center items-center h-full mt-12">
      <Card className="max-w-xl w-full shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <Icon icon="mdi:briefcase-outline" className="text-blue-600" width={48} height={48} />
          <h2 className="text-2xl font-bold text-gray-900">Welcome, Staff</h2>
        </CardHeader>
        <CardBody className="text-center text-gray-600">
          Support operations, manage internal tasks and assist the administration.
        </CardBody>
      </Card>
    </div>
  );
}
