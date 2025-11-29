import { AlertTriangle, Mail, Smartphone, ExternalLink } from 'lucide-react'
import * as m from '../paraglide/messages'
import { localizeUrl } from '../paraglide/runtime'

interface ThreatExample {
  type: 'email' | 'sms'
  title: string
  preview: string
  redFlags: string[]
  category: string
}

export default function ThreatExamples() {
  const examples: ThreatExample[] = [
    {
      type: 'email',
      title: m.home_threats_example1_title(),
      preview: m.home_threats_example1_preview(),
      redFlags: [
        m.home_threats_example1_flag1(),
        m.home_threats_example1_flag2(),
        m.home_threats_example1_flag3(),
        m.home_threats_example1_flag4(),
      ],
      category: m.home_threats_example1_category(),
    },
    {
      type: 'sms',
      title: m.home_threats_example2_title(),
      preview: m.home_threats_example2_preview(),
      redFlags: [
        m.home_threats_example2_flag1(),
        m.home_threats_example2_flag2(),
        m.home_threats_example2_flag3(),
        m.home_threats_example2_flag4(),
      ],
      category: m.home_threats_example2_category(),
    },
    {
      type: 'email',
      title: m.home_threats_example3_title(),
      preview: m.home_threats_example3_preview(),
      redFlags: [
        m.home_threats_example3_flag1(),
        m.home_threats_example3_flag2(),
        m.home_threats_example3_flag3(),
        m.home_threats_example3_flag4(),
      ],
      category: m.home_threats_example3_category(),
    },
  ]

  // Helper function to properly handle localizeUrl return type
  const getLocalizedHref = (href: string): string => {
    const result = localizeUrl(href)
    return typeof result === 'string' ? result : result.href
  }

  return (
    <section className="section-spacing bg-white border-t border-slate-200">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-4 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            {m.home_threats_badge()}
          </div>
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            {m.home_threats_title()}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {m.home_threats_subtitle()}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden hover:border-red-200 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left side - Message preview */}
                <div className="p-8 bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${example.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {example.type === 'email' ? (
                        <Mail className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {example.title}
                      </h3>
                      <div className="text-sm text-slate-500 font-medium">
                        {example.category}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">
                    {example.preview}
                  </div>
                </div>

                {/* Right side - Red flags */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-slate-900 text-lg">
                      {m.home_threats_red_flags_title()}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {example.redFlags.map((flag, flagIndex) => (
                      <li key={flagIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">
                          {flagIndex + 1}
                        </div>
                        <span className="text-slate-700 leading-relaxed">
                          {flag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Educational callout */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
              {m.home_threats_cta_title()}
            </h3>
            <p className="text-slate-700 mb-6 text-center leading-relaxed">
              {m.home_threats_cta_text()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={getLocalizedHref('/submit/email')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {m.home_threats_cta_submit()}
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={getLocalizedHref('/learn')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border-2 border-slate-300 hover:border-slate-400 transition-all duration-200"
              >
                {m.home_threats_cta_learn()}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
