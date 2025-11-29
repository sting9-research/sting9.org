import { Upload, Lock, Database, Brain, ArrowRight } from 'lucide-react'

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
      title: 'Submit Suspicious Message',
      description: 'Forward phishing emails or paste smishing texts. Upload screenshots or message files. Anonymous submissions welcome.',
      color: 'bg-blue-500',
    },
    {
      number: 2,
      icon: <Lock className="w-8 h-8" />,
      title: 'Automated Anonymization',
      description: 'Our system immediately redacts all personal information—emails, phone numbers, names, addresses, and identifiers—to protect your privacy.',
      color: 'bg-purple-500',
    },
    {
      number: 3,
      icon: <Database className="w-8 h-8" />,
      title: 'Added to Open Dataset',
      description: 'The anonymized message joins our CC0 public dataset, categorized by type, language, and threat characteristics for research access.',
      color: 'bg-emerald-500',
    },
    {
      number: 4,
      icon: <Brain className="w-8 h-8" />,
      title: 'Powers AI Detection',
      description: 'Your contribution trains machine learning models used by individuals, organizations, and researchers to detect and prevent future attacks.',
      color: 'bg-amber-500',
    },
  ]

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From submission to protection in four transparent steps
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
              Your Contribution Matters
            </h3>
            <p className="text-slate-600 mb-6">
              Every message you submit helps protect millions of people from digital deception.
              Together, we're building the most comprehensive anti-phishing defense system ever created.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              Learn more about our mission
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
