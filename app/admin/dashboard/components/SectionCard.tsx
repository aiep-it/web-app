"use client";

import React, { Component, ReactNode } from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

class SectionCard extends Component<SectionCardProps> {
  render() {
    const { title, children, action } = this.props;

    return (
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {action}
        </CardHeader>
        <CardBody>{children}</CardBody>
      </Card>
    );
  }
}

export default SectionCard;
