import { createFileRoute } from '@tanstack/react-router'
import {
  Shield,
  Target,
  Users,
  Globe,
  TrendingUp,
  CheckCircle2,
  Mail,
  Smartphone,
  MessageSquare,
  Code,
  Building2,
  GraduationCap,
  Heart
} from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const problems = [
    { stat: '5.3B', label: 'phishing emails sent daily' },
    { stat: '$10.3B', label: 'lost to scams annually' },
    { stat: '1 in 3', label: 'people have fallen victim' },
    { stat: '87%', label: 'of smishing attacks bypass filters' },
  ]

  const approaches = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community-Driven Collection',
      description: 'Building a global network of contributors who submit suspected phishing and smishing messages. Every contribution helps our AI learn new attack patterns.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-Source Integration',
      description: 'Aggregating and standardizing data from user submissions, partner organizations, academic research, threat intelligence feeds, and honeypot networks.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Advanced AI Training',
      description: 'Machine learning models analyze message content, sender patterns, URLs, social engineering tactics, and cross-language threat patterns.',
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Open-Source Commitment',
      description: 'All datasets and trained models freely available to researchers, security companies, developers, and anyone combating digital fraud.',
    },
  ]

  const messageTypes = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Emails',
      description: 'Phishing, spear-phishing, business email compromise (BEC)',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'SMS/Text',
      description: 'Smishing, spam texts, fraudulent alerts',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Messaging Apps',
      description: 'WhatsApp, Telegram, Signal scams',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Social Media',
      description: 'Fraudulent DMs and posts',
    },
  ]

  const roadmap = [
    {
      phase: 'Phase 1: Foundation',
      period: 'Q3 2025',
      goals: ['Launch collection platform', 'Build initial dataset (1M messages)', 'Release alpha AI model'],
    },
    {
      phase: 'Phase 2: Growth',
      period: 'Q4 2025',
      goals: ['Scale to 10M messages', 'Multi-language support', 'Public API release'],
    },
    {
      phase: 'Phase 3: Intelligence',
      period: 'Q1 2026',
      goals: ['Advanced ML models', 'Real-time threat feeds', 'Industry partnerships'],
    },
    {
      phase: 'Phase 4: Impact',
      period: '2026',
      goals: ['50M message dataset', '99.9% accuracy achieved', 'Global protection network'],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20"></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg">
                  <img
                    src="/sting9-logo.webp"
                    alt="Sting9 Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-hero font-bold text-slate-900 mb-6">
              About Sting9
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
              Named after the legendary sword from Lord of the Rings that glows blue when danger is near,
              Sting9 illuminates the threats hiding in your inbox.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed text-center mb-12">
              The Sting9 Research Initiative is building the world's most comprehensive open-source dataset
              of phishing, smishing, and scam messages to train AI models capable of detecting malicious
              communications with 99.9% accuracy. By combining community contributions with existing datasets,
              we're creating a powerful resource to protect billions of users from digital deception.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-6 text-center">
              The Problem
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed text-center mb-12">
              Every day, millions of people receive fraudulent messages designed to steal their personal
              information, money, and digital identities. Current detection systems struggle to keep pace
              with evolving threats:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-md border border-slate-200 text-center"
                >
                  <div className="text-5xl font-bold text-amber-600 mb-2">
                    {problem.stat}
                  </div>
                  <div className="text-slate-600">
                    {problem.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              Our Approach
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {approaches.map((approach, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-8 border border-slate-200"
                >
                  <div className="text-amber-600 mb-4">
                    {approach.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {approach.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {approach.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Collect */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              What We Collect
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messageTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-slate-200 flex items-start gap-4"
                >
                  <div className="bg-amber-100 p-3 rounded-lg text-amber-600 flex-shrink-0">
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-slate-600">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy First */}
            <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">Privacy First</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>All personal information is automatically redacted</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Submissions are anonymized</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>No tracking of contributors</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>GDPR and privacy law compliant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              Roadmap
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roadmap.map((phase, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200 hover:border-amber-300 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{phase.phase}</div>
                      <div className="text-sm text-slate-600">{phase.period}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {phase.goals.map((goal, goalIndex) => (
                      <li key={goalIndex} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              Get Involved
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <GraduationCap className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Researchers</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Access our API and datasets</li>
                  <li>• Contribute analysis and improvements</li>
                  <li>• Collaborate on papers and studies</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <Code className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Developers</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Integrate Sting9 detection into apps</li>
                  <li>• Contribute to open-source tools</li>
                  <li>• Build on our infrastructure</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <Building2 className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Organizations</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Protect users and employees</li>
                  <li>• Share threat intelligence</li>
                  <li>• Sponsor dataset growth</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <Heart className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Individuals</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Submit suspicious messages</li>
                  <li>• Beta test new features</li>
                  <li>• Spread awareness</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-slate-50 rounded-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-slate-600 mb-6">
                Join the fight against digital deception. Every contribution matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/submit/email"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  Submit a Message
                </a>
                <a
                  href="/partners"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  Become a Partner
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container-custom text-center">
          <p className="text-2xl font-bold mb-2">
            Together, we can make digital deception obsolete.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
