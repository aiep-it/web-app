"use client";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const CDrawer: React.FC<DrawerProps> = ({ isOpen, onOpenChange, children }) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  );
};

export default CDrawer;
