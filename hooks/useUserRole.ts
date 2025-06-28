// hooks/useUserRole.ts
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export function useUserRole() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isLoaded || !isSignedIn) {
        setUserRole(null);
        setIsRoleLoading(false);
        return;
      }

      try {
        setIsRoleLoading(true);
        const token = await getToken();
        // const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
        const backendUrl = "http://localhost:3001";
        const res = await fetch(`${backendUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 404) {
            console.warn("User not found in DB, defaulting to 'user'");
            setUserRole("user");
          } else {
            throw new Error(errorData.message || "Failed to fetch role");
          }
        } else {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (err: any) {
        toast.error(err.message || "Lỗi khi lấy vai trò người dùng");
        setUserRole(null);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [isLoaded, isSignedIn, getToken]);

  return { userRole, isRoleLoading, isSignedIn };
}
