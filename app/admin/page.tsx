"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Avatar, Progress } from "@heroui/react";
import { useUser } from "@clerk/nextjs";

export default function LoginSuccessPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();


  const name = useMemo(
    () => (user?.firstName?.trim() ? user.firstName : user?.username || "ADMIN"),
    [user]
  );
  const imageUrl = user?.imageUrl ?? undefined;
  const role = useMemo<string>(() => {
    const pub = (user?.publicMetadata as any)?.role; 
    const unsafe = (user?.unsafeMetadata as any)?.role;
    return (pub  || unsafe || "user") as string;
  }, [user]);

  const target = useMemo(() => {
    const r = role?.toLowerCase();
    if (r === "admin") return "/admin/dashboard";
    if (r === "staff") return "/admin/usermanage";
    return "/";
  }, [role]);

  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    let v = 0;
    const durationMs = 900;
    const fps = 60;
    const tick = 1000 / fps;
    const step = 100 / (durationMs / tick);

    const id = setInterval(() => {
      v = Math.min(100, v + step);
      setVal(v);
    }, tick);

    const done = setTimeout(() => {
      clearInterval(id);
      router.replace(target);
    }, durationMs + 180);

    return () => {
      clearInterval(id);
      clearTimeout(done);
    };
  }, [isLoaded, isSignedIn, router, target]);

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <Card className="w-full max-w-4xl rounded-3xl shadow-2xl">
        <CardBody className="p-16">
          <div className="mb-8 flex items-center gap-8">
            <Avatar src={imageUrl} name={name} className="h-24 w-24 text-2xl" />
            <div>
              <p className="text-3xl font-bold leading-tight">
                Chào,{" "}
                <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                  {name}
                </span>
                !
              </p>
              <p className="mt-1 text-lg text-default-500">
                Đăng nhập thành công — đang vào{" "}
                <span className="font-semibold">
                  {role?.toLowerCase() === "admin"
                    ? "Dashboard quản trị"
                    : role?.toLowerCase() === "staff"
                    ? "Quản lý người dùng"
                    : "Dashboard"}
                </span>
                …
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-3 -top-1 h-16 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 opacity-50 blur-2xl" />
            <Progress
              aria-label="Đang chuyển hướng"
              value={val}
              maxValue={100}
              size="lg"
              className="relative"
              classNames={{
                base: "h-6 rounded-full",
                track:
                  "rounded-full bg-default-200/70 dark:bg-default-100/40 backdrop-blur",
                indicator:
                  "rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite]",
              }}
              showValueLabel={false}
            />
          </div>

         
        </CardBody>
      </Card>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </div>
  );
}
