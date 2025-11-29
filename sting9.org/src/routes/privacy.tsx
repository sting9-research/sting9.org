import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import Footer from '../components/Footer'
import { MarkdownContent } from '../components/MarkdownContent'
import { loadMarkdownContent } from '../lib/markdown'

export const Route = createFileRoute('/privacy')({ component: PrivacyPage })

function PrivacyPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarkdownContent('privacy')
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading privacy policy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-linear-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markdown Content */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <MarkdownContent content={content} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
