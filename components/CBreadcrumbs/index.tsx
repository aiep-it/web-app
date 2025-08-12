// components/CBreadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

const LABEL_MAP: Record<string, string> = {
  admin: "Admin",
  users: "Users",
  roadmaps: "Roadmaps",
};

const isIdLike = (part: string) =>
  /^[0-9a-f-]{24,}$/.test(part) || /^\d+$/.test(part); // số, uuid-like

export default function CBreadcrumbs() {
  const pathname = usePathname(); // e.g. /admin/roadmaps/123/edit
  const parts = pathname.split("/").filter(Boolean);

  const items = parts.map((part, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const raw = decodeURIComponent(part);
    const name =
      LABEL_MAP[raw] ??
      raw.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return { name, href, part: raw, idx };
  });

  // Ẩn id nếu muốn:
  const visibleItems = items.filter((it, i) =>
    i === items.length - 1 ? true : !isIdLike(it.part)
  );

  return (
    <Breadcrumbs className="my-2">
      {visibleItems.map((it, i) => {
        const isLast = i === visibleItems.length - 1;
        return (
          <BreadcrumbItem key={it.href}>
            {isLast ? (
              it.name
            ) : (
              <Link href={it.href} className="text-primary hover:underline">
                {it.name}
              </Link>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
}
