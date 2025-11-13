import { Users, Building2, GraduationCap, CheckCircle2, TrendingUp, Zap } from 'lucide-react'

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

interface Enabler {
  icon: React.ReactNode
  title: string
  description: string
  stat: string
}

export default function ImpactSection() {
  const whatWeEnable: Enabler[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: '99.9% Accurate AI Models',
      description: 'State-of-the-art machine learning trained on the largest, most diverse phishing dataset ever created.',
      stat: '99.9%',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-Time Threat Intelligence',
      description: 'Live feeds of emerging attack patterns, malicious URLs, and new scam techniques as they appear.',
      stat: 'Real-time',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Open Research Access',
      description: 'Free API and dataset downloads for academic researchers, developers, and security professionals worldwide.',
      stat: 'Free',
    },
  ]

  const whoBenefits: Benefit[] = [
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Individuals',
      description: 'Everyday users gain protection through email clients, messaging apps, and browsers powered by our detection models.',
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: 'Organizations',
      description: 'Businesses integrate our API to protect employees from BEC, credential harvesting, and targeted phishing campaigns.',
    },
    {
      icon: <GraduationCap className="w-10 h-10" />,
      title: 'Researchers',
      description: 'Academic institutions and security labs use our dataset to advance cybersecurity science and develop new defenses.',
    },
  ]

  return (
    <section className="section-spacing bg-gradient-to-b from-slate-50 to-white">
      <div className="container-custom">
        {/* Main heading */}
        <div className="text-center mb-20">
          <h2 className="text-h2 font-bold text-slate-900 mb-4">
            The Impact We're Creating
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From open data to global protection, our mission reaches millions
          </p>
        </div>

        {/* What we enable */}
        <div className="mb-20">
          <h3 className="text-h3 font-bold text-slate-900 text-center mb-12">
            What This Dataset Enables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whatWeEnable.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-xl hover:border-amber-300 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 text-8xl font-black text-slate-50 group-hover:text-amber-50 transition-colors -mr-4 -mt-4">
                  {item.stat}
                </div>
                <div className="relative z-10">
                  <div className="text-amber-600 mb-4">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who benefits */}
        <div className="mb-16">
          <h3 className="text-h3 font-bold text-slate-900 text-center mb-12">
            Who Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whoBenefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700 hover:bg-amber-100 hover:text-amber-600 transition-all duration-300">
                  {benefit.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-3">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open source commitment */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6 text-center">
                Our Open-Source Commitment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">ODC-BY-NC License</div>
                    <div className="text-slate-300 text-sm">Open Data Commons Attribution-NonCommercial—free for research and non-commercial use</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Free API Access</div>
                    <div className="text-slate-300 text-sm">RESTful API for researchers and developers—no paywalls</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Transparent Methodology</div>
                    <div className="text-slate-300 text-sm">Open documentation of collection, anonymization, and classification processes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Pre-Trained Models</div>
                    <div className="text-slate-300 text-sm">Detection models freely available for personal and research use</div>
                  </div>
                </div>
              </div>
              <p className="text-center text-slate-300 italic text-lg">
                "Making digital deception obsolete through radical transparency and collaboration"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Import Brain icon
import { Brain } from 'lucide-react'
