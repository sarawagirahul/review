'use client'

const platforms = [
  {
    name: 'Instagram Analytics',
    status: 'Connect Instagram Business — Coming Phase 2',
    gradient: 'from-pink-400/20 to-purple-400/20',
    borderColor: 'border-pink-200',
    label: 'IG',
    iconBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
  },
  {
    name: 'Facebook Insights',
    status: 'Connect Facebook Page — Coming Phase 2',
    gradient: 'from-blue-400/20 to-blue-600/20',
    borderColor: 'border-blue-200',
    label: 'f',
    iconBg: 'bg-blue-600',
  },
  {
    name: 'Website Analytics',
    status: 'Connect Google Analytics — Coming Phase 2',
    gradient: 'from-green-400/20 to-teal-400/20',
    borderColor: 'border-green-200',
    label: 'GA',
    iconBg: 'bg-gradient-to-br from-green-500 to-teal-500',
  },
]

export default function SocialWebTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {platforms.map(platform => (
        <div
          key={platform.name}
          className={`rounded-xl p-6 text-center border bg-gradient-to-br ${platform.gradient} ${platform.borderColor}`}
        >
          <div className={`h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${platform.iconBg} text-white font-bold text-2xl`}>
            {platform.label}
          </div>
          <h3 className="text-base font-semibold text-ink mb-2">{platform.name}</h3>
          <p className="text-sm text-muted mb-4">{platform.status}</p>
          <button
            onClick={() => {
              const key = `jh_notify_${platform.name.replace(/\s+/g, '_').toLowerCase()}`
              localStorage.setItem(key, 'true')
            }}
            className="px-4 py-2 border border-hairline rounded-lg text-sm text-ink hover:bg-white/70 transition-colors cursor-pointer"
          >
            Notify me when ready
          </button>
        </div>
      ))}
    </div>
  )
}
