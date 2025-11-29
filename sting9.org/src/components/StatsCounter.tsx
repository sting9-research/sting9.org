import { Database, Globe, Languages, Target } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as m from '../paraglide/messages'

interface Stat {
  icon: React.ReactNode
  value: string
  label: string
  suffix?: string
  color: string
}

interface ApiStats {
  total_submissions: number
  submissions_by_type: Record<string, number>
  submissions_by_category: Record<string, number>
  submissions_by_status: Record<string, number>
  languages_detected: Record<string, number>
  submissions_by_date: Record<string, number>
  updated_at: string
}

export default function StatsCounter() {
  const [apiStats, setApiStats] = useState<ApiStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.sting9.org/api/v1/stats')
      .then(res => res.json())
      .then(data => {
        setApiStats(data.statistics)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err)
        setLoading(false)
      })
  }, [])

  // Calculate stats from API data
  const languageCount = apiStats ? Object.keys(apiStats.languages_detected).filter(lang => lang !== 'unknown').length : 0
  const categoryCount = apiStats ? Object.keys(apiStats.submissions_by_category).length : 0
  const totalSubmissions = apiStats?.total_submissions || 0

  const stats: Stat[] = [
    {
      icon: <Database className="w-8 h-8" />,
      value: loading ? '...' : totalSubmissions.toLocaleString(),
      label: m.home_stats_messages_collected(),
      color: 'text-emerald-600',
    },
    {
      icon: <Languages className="w-8 h-8" />,
      value: loading ? '...' : languageCount.toString(),
      label: m.home_stats_languages_detected(),
      suffix: '+',
      color: 'text-blue-600',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: loading ? '...' : Object.keys(apiStats?.submissions_by_type || {}).length.toString(),
      label: m.home_stats_message_types(),
      color: 'text-purple-600',
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: loading ? '...' : categoryCount.toString(),
      label: m.home_stats_threat_categories(),
      suffix: '+',
      color: 'text-amber-600',
    },
  ]

  return (
    <section className="section-spacing bg-slate-50 border-y border-slate-200">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            {m.home_stats_title()}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {m.home_stats_subtitle()}
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
                {m.home_stats_progress_title()}
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {loading ? '...' : `${((totalSubmissions / 1000000) * 100).toFixed(2)}%`}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-linear-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: loading ? '0%' : `${Math.min((totalSubmissions / 1000000) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-3 text-center">
              {loading ? m.home_stats_loading() : `${totalSubmissions.toLocaleString()} ${m.home_stats_progress_text()}`}
            </p>
          </div>
        </div>
      </div>

      <style>{`
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
