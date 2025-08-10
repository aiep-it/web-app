export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <div className="min-h-screen bg-purple-100">
      <header className="p-4 bg-purple-600 text-white">Parent Header</header>
      <main className="p-6">{children}</main>
    </div>
  );
}