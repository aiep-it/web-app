import RoleGate from "@/components/RoleGate";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
     <RoleGate allowedRoles={['student']}>
    <div className="min-h-screen bg-teal-100">
      <header className="p-4 bg-teal-600 text-white">Staff Header</header>
      <main className="p-6">{children}</main>
    </div>
    </RoleGate>
  );
}