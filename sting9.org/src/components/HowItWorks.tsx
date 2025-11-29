import { Upload, Lock, Database, Brain, ArrowRight } from 'lucide-react'
import * as m from '../paraglide/messages'
import { localizeUrl } from '../paraglide/runtime'

interface Step {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      number: 1,
      icon: <Upload className="w-8 h-8" />,
      title: m.home_how_it_works_step1_title(),
      description: m.home_how_it_works_step1_description(),
      color: 'bg-blue-500',
    },
    {
      number: 2,
      icon: <Lock className="w-8 h-8" />,
      title: m.home_how_it_works_step2_title(),
      description: m.home_how_it_works_step2_description(),
      color: 'bg-purple-500',
    },
    {
      number: 3,
      icon: <Database className="w-8 h-8" />,
      title: m.home_how_it_works_step3_title(),
      description: m.home_how_it_works_step3_description(),
      color: 'bg-emerald-500',
    },
    {
      number: 4,
      icon: <Brain className="w-8 h-8" />,
      title: m.home_how_it_works_step4_title(),
      description: m.home_how_it_works_step4_description(),
      color: 'bg-amber-500',
    },
  ]

  // Helper function to properly handle localizeUrl return type
  const getLocalizedHref = (href: string): string => {
    const result = localizeUrl(href)
    return typeof result === 'string' ? result : result.href
  }

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            {m.home_how_it_works_title()}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {m.home_how_it_works_subtitle()}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection lines - hidden on mobile */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 via-purple-500 via-emerald-500 to-amber-500 opacity-20"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative flex">
                {/* Step card */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative z-10 flex flex-col h-full w-full">
                  {/* Step number badge */}
                  <div className={`${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg shrink-0`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-slate-700 mb-4 shrink-0">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed flex-grow">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-slate-50 rounded-xl p-8 max-w-3xl mx-auto border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {m.home_how_it_works_cta_title()}
            </h3>
            <p className="text-slate-600 mb-6">
              {m.home_how_it_works_cta_text()}
            </p>
            <a
              href={getLocalizedHref('/about')}
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              {m.home_how_it_works_cta_link()}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
