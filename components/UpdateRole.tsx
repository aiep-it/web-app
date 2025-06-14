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
        title: "Please Signin",
        color: "danger",
      });
      return;
    }
    const payload: UpdateRoleRequest = { userId: user.id, role: "admin" };
    const res = await updateRole(payload);
    if (res) {
      addToast({
        title: "Ok",
        color: 'success',
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
