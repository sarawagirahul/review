export default function BusinessesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display text-3xl font-medium text-ink mb-2">My Businesses</h1>
        <p className="text-body">Manage your connected businesses here.</p>
      </div>
      
      <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm min-h-[400px] flex items-center justify-center text-muted">
        Select a business from the dashboard to manage it.
      </div>
    </div>
  )
}
