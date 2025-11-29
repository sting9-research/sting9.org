import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Database, PieChart, Calendar, Globe, TrendingUp, RefreshCw } from 'lucide-react'
import Footer from '../components/Footer'
import * as m from '../paraglide/messages.js'

export const Route = createFileRoute('/stats')({
  component: StatsPage,
})

interface ApiStats {
  total_submissions: number
  submissions_by_type: Record<string, number>
  submissions_by_category: Record<string, number>
  submissions_by_status: Record<string, number>
  languages_detected: Record<string, number>
  submissions_by_date: Record<string, number>
  updated_at: string
}

function StatsPage() {
  const [apiStats, setApiStats] = useState<ApiStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchStats = () => {
    setLoading(true)
    fetch('https://api.sting9.org/api/v1/stats')
      .then(res => res.json())
      .then(data => {
        setApiStats(data.statistics)
        setLastUpdated(new Date(data.statistics.updated_at).toLocaleString())
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getCategoryColor = (index: number): string => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-linear-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <PieChart className="w-4 h-4" />
              <span>{m.stats_badge()}</span>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              {m.stats_title()}
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-6">
              {m.stats_description()}
            </p>
            {lastUpdated && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{m.stats_last_updated()} {lastUpdated}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">{m.stats_total_messages()}</span>
              </div>
              <div className="text-4xl font-bold text-emerald-900">
                {loading ? '...' : (apiStats?.total_submissions || 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800 uppercase tracking-wide">{m.stats_message_types()}</span>
              </div>
              <div className="text-4xl font-bold text-blue-900">
                {loading ? '...' : Object.keys(apiStats?.submissions_by_type || {}).length}
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <PieChart className="w-6 h-6 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">{m.stats_threat_categories()}</span>
              </div>
              <div className="text-4xl font-bold text-amber-900">
                {loading ? '...' : Object.keys(apiStats?.submissions_by_category || {}).length}
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800 uppercase tracking-wide">{m.stats_languages()}</span>
              </div>
              <div className="text-4xl font-bold text-purple-900">
                {loading ? '...' : Object.keys(apiStats?.languages_detected || {}).filter(lang => lang !== 'unknown').length}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? m.stats_refreshing() : m.stats_refresh()}
            </button>
          </div>
        </div>
      </section>

      {/* Message Types Breakdown */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8">
            {m.stats_by_type()}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {apiStats && Object.entries(apiStats.submissions_by_type)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count], index) => {
                const percentage = ((count / apiStats.total_submissions) * 100).toFixed(1)
                return (
                  <div key={type} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 capitalize">{type}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(index)}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {count.toLocaleString()}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(index)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* Threat Categories Breakdown */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8">
            {m.stats_by_category()}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiStats && Object.entries(apiStats.submissions_by_category)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count], index) => {
                const percentage = ((count / apiStats.total_submissions) * 100).toFixed(1)
                return (
                  <div key={category} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-slate-900">
                        {formatCategoryName(category)}
                      </h3>
                      <span className="text-xs font-medium text-slate-600">
                        {percentage}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-2">
                      {count.toLocaleString()}
                    </div>
                    <div className="w-full bg-slate-300 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getCategoryColor(index)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* Languages Breakdown */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8">
            {m.stats_by_language()}
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {apiStats && Object.entries(apiStats.languages_detected)
              .sort(([, a], [, b]) => b - a)
              .map(([language, count], index) => {
                const percentage = ((count / apiStats.total_submissions) * 100).toFixed(1)
                const displayName = language === 'en' ? 'English' :
                                   language === 'unknown' ? 'Unknown' :
                                   language === 'other' ? 'Other' : language.toUpperCase()
                return (
                  <div key={language} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                        {displayName}
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1">
                        {count.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {percentage}% of total
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8">
            {m.stats_recent_activity()}
          </h2>

          <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
            <div className="space-y-4">
              {apiStats && Object.entries(apiStats.submissions_by_date)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 10)
                .map(([date, count]) => (
                  <div key={date} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-slate-700">
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-300 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-linear-to-r from-emerald-500 to-emerald-600 h-6 flex items-center justify-end pr-2"
                            style={{
                              width: `${Math.min((count / Math.max(...Object.values(apiStats.submissions_by_date))) * 100, 100)}%`,
                              minWidth: '60px'
                            }}
                          >
                            <span className="text-xs font-semibold text-white">
                              {count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-spacing bg-linear-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {m.stats_cta_title()}
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              {m.stats_cta_text()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/submit/email"
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                {m.stats_submit_email()}
              </a>
              <a
                href="/submit/sms"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors"
              >
                {m.stats_submit_sms()}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
