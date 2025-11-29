import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import Footer from '../components/Footer'
import { MarkdownContent } from '../components/MarkdownContent'
import { loadMarkdownContent } from '../lib/markdown'

export const Route = createFileRoute('/terms')({ component: TermsPage })

function TermsPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarkdownContent('terms')
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading terms of service...</p>
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
              <div className="bg-blue-100 p-4 rounded-full">
                <FileText className="w-12 h-12 text-blue-600" />
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
