// components/Breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
// import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function CBreadcrumbs() {
  const pathname = usePathname(); // e.g. /admin/users/123
  const pathParts = pathname.split("/").filter((part) => part);

  const breadcrumbs = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    const name = decodeURIComponent(part).replace(/-/g, " ");

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      href,
    };
  });

  return (
    <Breadcrumbs className="my-2">
      {breadcrumbs.map((item) => {
        return <BreadcrumbItem key={item.name}>{item.name}</BreadcrumbItem>;
      })}
    </Breadcrumbs>
  );
}
