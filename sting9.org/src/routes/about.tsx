import { createFileRoute } from '@tanstack/react-router'
import {
  Shield,
  Target,
  Users,
  Globe,
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
import * as m from '../paraglide/messages.js'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const problems = [
    { stat: '5.3B', label: m.about_problem_stat1() },
    { stat: '$10.3B', label: m.about_problem_stat2() },
    { stat: '1 in 3', label: m.about_problem_stat3() },
    { stat: '87%', label: m.about_problem_stat4() },
  ]

  const approaches = [
    {
      icon: <Users className="w-8 h-8" />,
      title: m.about_approach1_title(),
      description: m.about_approach1_description(),
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: m.about_approach2_title(),
      description: m.about_approach2_description(),
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: m.about_approach3_title(),
      description: m.about_approach3_description(),
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: m.about_approach4_title(),
      description: m.about_approach4_description(),
    },
  ]

  const messageTypes = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: m.about_collect_emails_title(),
      description: m.about_collect_emails_description(),
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: m.about_collect_sms_title(),
      description: m.about_collect_sms_description(),
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: m.about_collect_messaging_title(),
      description: m.about_collect_messaging_description(),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: m.about_collect_social_title(),
      description: m.about_collect_social_description(),
    },
  ]

  const roadmap = [
    {
      phase: m.about_phase1_title(),
      period: m.about_phase1_period(),
      goals: [m.about_phase1_goal1(), m.about_phase1_goal2(), m.about_phase1_goal3()],
    },
    {
      phase: m.about_phase2_title(),
      period: m.about_phase2_period(),
      goals: [m.about_phase2_goal1(), m.about_phase2_goal2(), m.about_phase2_goal3()],
    },
    {
      phase: m.about_phase3_title(),
      period: m.about_phase3_period(),
      goals: [m.about_phase3_goal1(), m.about_phase3_goal2(), m.about_phase3_goal3()],
    },
    {
      phase: m.about_phase4_title(),
      period: m.about_phase4_period(),
      goals: [m.about_phase4_goal1(), m.about_phase4_goal2(), m.about_phase4_goal3()],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-linear-to-b from-slate-50 to-white">
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
              {m.about_title()}
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed mb-8">
              {m.about_tagline()}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-6 text-center">
              {m.about_mission_title()}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed text-center mb-12">
              {m.about_mission_text()}
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-6 text-center">
              {m.about_problem_title()}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed text-center mb-12">
              {m.about_problem_text()}
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
              {m.about_approach_title()}
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
              {m.about_collect_title()}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messageTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-slate-200 flex items-start gap-4"
                >
                  <div className="bg-amber-100 p-3 rounded-lg text-amber-600 shrink-0">
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
            <div className="mt-12 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">{m.about_privacy_title()}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{m.about_privacy1()}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{m.about_privacy2()}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{m.about_privacy3()}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{m.about_privacy4()}</span>
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
              {m.about_roadmap_title()}
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
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
      <section className="section-spacing bg-linear-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              {m.about_involved_title()}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <GraduationCap className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{m.about_researchers_title()}</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• {m.about_researchers_item1()}</li>
                  <li>• {m.about_researchers_item2()}</li>
                  <li>• {m.about_researchers_item3()}</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <Code className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{m.about_developers_title()}</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• {m.about_developers_item1()}</li>
                  <li>• {m.about_developers_item2()}</li>
                  <li>• {m.about_developers_item3()}</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <Building2 className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{m.about_organizations_title()}</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• {m.about_organizations_item1()}</li>
                  <li>• {m.about_organizations_item2()}</li>
                  <li>• {m.about_organizations_item3()}</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <Heart className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{m.about_individuals_title()}</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• {m.about_individuals_item1()}</li>
                  <li>• {m.about_individuals_item2()}</li>
                  <li>• {m.about_individuals_item3()}</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-slate-50 rounded-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {m.about_cta_title()}
              </h3>
              <p className="text-slate-600 mb-6">
                {m.about_cta_text()}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/submit/email"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  {m.about_cta_submit()}
                </a>
                <a
                  href="/partners"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  {m.about_cta_partner()}
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
            {m.about_closing()}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
