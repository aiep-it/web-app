import RoleGate from "@/components/RoleGate";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate allowedRoles={['teacher']}>
    <div className="min-h-screen bg-green-100">
      <header className="p-4 bg-green-600 text-white">Teacher Header</header>
      <main className="p-6">{children}</main>
    </div>
    </RoleGate>
  );
}
