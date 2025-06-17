// web-app/components/UpdateRole.tsx
"use client";
import { UpdateRoleRequest } from "@/services/types/user";
import { updateRole } from "@/services/user";
import { useUser } from "@clerk/nextjs";
import { addToast } from "@heroui/react";

export default function UpdateRole() {
  const { user } = useUser();

  const handleUpdateRole = async () => {
    if (!user) {
      addToast({
        title: "Please Sign in",
        color: "danger",
      });
      return;
    }

    const payload: UpdateRoleRequest = { userId: user.id, role: "admin" };
    const res = await updateRole(payload);
    if (res) {
      addToast({
        title: "Role updated to admin",
        color: "success",
      });
    } else {
      addToast({
        title: "Failed to update role",
        color: "danger",
      });
    }
  };

  return (
    <button
      onClick={handleUpdateRole}
      className="bg-green-500 text-white p-2 rounded"
    >
      Set Admin Role
    </button>
  );
}
