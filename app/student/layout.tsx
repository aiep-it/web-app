import RoleGate from "@/components/RoleGate";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate allowedRoles={['student']}>
    <div className="min-h-screen bg-yellow-100">
      <header className="p-4 bg-yellow-600 text-white">Student Header</header>
      <main className="p-6">{children}</main>
    </div>
    </RoleGate>
  );
}