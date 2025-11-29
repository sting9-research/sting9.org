import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  nickname: string
  submission_count: number
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  updated_at: string
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('https://api.sting9.org/api/v1/leaderboard')

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
        console.error('Error fetching leaderboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh every 60 seconds
    const interval = setInterval(fetchLeaderboard, 60000)

    return () => clearInterval(interval)
  }, [])

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-amber-500" />
    if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />
    if (index === 2) return <Medal className="w-6 h-6 text-orange-600" />
    return <Award className="w-5 h-5 text-slate-400" />
  }

  const getRankBadgeColor = (index: number) => {
    if (index === 0) return 'bg-amber-100 text-amber-700 border-amber-300'
    if (index === 1) return 'bg-slate-100 text-slate-700 border-slate-300'
    if (index === 2) return 'bg-orange-100 text-orange-700 border-orange-300'
    return 'bg-slate-50 text-slate-600 border-slate-200'
  }

  const formatNickname = (nickname: string) => {
    // Truncate long nicknames for better display
    if (nickname.length > 30) {
      return nickname.substring(0, 27) + '...'
    }
    return nickname
  }

  const topThree = data?.leaderboard.slice(0, 3) || []
  const rest = data?.leaderboard.slice(3, 10) || []

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            Top Contributors
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Recognizing the heroes who help build the world's largest phishing detection dataset
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
            <p className="mt-4 text-slate-600">Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load leaderboard</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </div>
        )}

        {/* Top 3 Podium */}
        {!isLoading && !error && topThree.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="md:order-1 md:mt-8">
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-6 shadow-lg border-2 border-slate-300 text-center">
                    <div className="flex justify-center mb-3">
                      {getRankIcon(1)}
                    </div>
                    <div className="text-3xl font-bold text-slate-700 mb-1">#2</div>
                    <div className="text-sm font-medium text-slate-900 mb-2 truncate" title={topThree[1].nickname}>
                      {formatNickname(topThree[1].nickname)}
                    </div>
                    <div className="text-2xl font-bold text-slate-600">
                      {topThree[1].submission_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">submissions</div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="md:order-2">
                  <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-xl p-8 shadow-xl border-2 border-amber-400 text-center relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                      TOP CONTRIBUTOR
                    </div>
                    <div className="flex justify-center mb-3 mt-2">
                      {getRankIcon(0)}
                    </div>
                    <div className="text-4xl font-bold text-amber-700 mb-1">#1</div>
                    <div className="text-base font-bold text-slate-900 mb-3 truncate" title={topThree[0].nickname}>
                      {formatNickname(topThree[0].nickname)}
                    </div>
                    <div className="text-3xl font-bold text-amber-600">
                      {topThree[0].submission_count.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">submissions</div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="md:order-3 md:mt-8">
                  <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg border-2 border-orange-400 text-center">
                    <div className="flex justify-center mb-3">
                      {getRankIcon(2)}
                    </div>
                    <div className="text-3xl font-bold text-orange-700 mb-1">#3</div>
                    <div className="text-sm font-medium text-slate-900 mb-2 truncate" title={topThree[2].nickname}>
                      {formatNickname(topThree[2].nickname)}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {topThree[2].submission_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">submissions</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of Top 10 */}
        {!isLoading && !error && rest.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Top 4-10 Contributors
            </h3>
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {rest.map((entry, index) => {
                  const actualRank = index + 4
                  return (
                    <div
                      key={entry.nickname}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${getRankBadgeColor(actualRank - 1)} flex items-center justify-center font-bold text-sm`}>
                          #{actualRank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate" title={entry.nickname}>
                            {entry.nickname}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xl font-bold text-slate-700">
                          {entry.submission_count.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">submissions</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data?.leaderboard.length === 0 && (
          <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No Contributors Yet
            </h3>
            <p className="text-slate-600">
              Be the first to contribute and claim the top spot!
            </p>
          </div>
        )}

        {/* Call to Action */}
        {!isLoading && !error && data && data.leaderboard.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-slate-700 mb-4">
                <strong>Want to see your nickname here?</strong> Submit suspicious messages and include your nickname to join the leaderboard!
              </p>
              <a
                href="/submit/email"
                className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
              >
                Start Contributing
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
