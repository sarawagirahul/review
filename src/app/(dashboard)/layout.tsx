export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar will go here */}
      <aside className="w-64 border-r border-hairline bg-surface-soft p-6 hidden md:block">
        <div className="font-display text-xl font-semibold text-ink mb-8">
          ReviewBoost
        </div>
        <nav className="space-y-2 text-sm text-body">
          <div>Dashboard Overview</div>
          <div>My Businesses</div>
          <div>Settings</div>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
