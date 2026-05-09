import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-canvas text-body font-sans">
      <aside className="w-64 border-r border-hairline bg-surface-soft p-6 hidden md:flex md:flex-col">
        <div className="font-display text-xl font-bold text-ink mb-10 flex items-center gap-2">
          ReviewBoost
        </div>
        <nav className="space-y-2 text-sm font-medium text-muted flex-1 flex flex-col">
          <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all">Dashboard Overview</Link>
          <Link href="/dashboard/businesses" className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all">My Businesses</Link>
          <Link href="/dashboard/settings" className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all">Settings</Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-hairline">
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="px-3 py-2 text-sm font-medium text-signature-coral hover:bg-white rounded-md transition-all w-full text-left cursor-pointer">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
