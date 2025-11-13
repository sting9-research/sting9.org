import { Database, Globe, Languages, Target } from 'lucide-react'

interface Stat {
  icon: React.ReactNode
  value: string
  label: string
  suffix?: string
  color: string
}

export default function StatsCounter() {
  const stats: Stat[] = [
    {
      icon: <Database className="w-8 h-8" />,
      value: '5,547',
      label: 'Messages Collected',
      color: 'text-emerald-600',
    },
    {
      icon: <Languages className="w-8 h-8" />,
      value: '12',
      label: 'Languages Supported',
      suffix: '+',
      color: 'text-blue-600',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: '8',
      label: 'Countries Contributing',
      color: 'text-purple-600',
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: '45',
      label: 'Attack Types Identified',
      suffix: '+',
      color: 'text-amber-600',
    },
  ]

  return (
    <section className="section-spacing bg-slate-50 border-y border-slate-200">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            Live Dataset Statistics
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real-time progress toward our goal of 1 million messages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300"
            >
              <div className={`${stat.color} mb-4 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2 text-center">
                {stat.value}{stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
              </div>
              <div className="text-sm font-medium text-slate-600 text-center uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress toward goal */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Progress to 1M Goal
              </span>
              <span className="text-2xl font-bold text-slate-900">
                0.55%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: '0.55%' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-3 text-center">
              Every submission brings us closer to 99.9% detection accuracy
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  )
}
