import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, XCircle, AlertTriangle, Scale } from 'lucide-react'
import Footer from '../components/Footer'
import * as m from '../paraglide/messages.js'

export const Route = createFileRoute('/license')({ component: LicensePage })

function LicensePage() {
  const permitted = [
    m.license_permitted1(),
    m.license_permitted2(),
    m.license_permitted3(),
    m.license_permitted4(),
    m.license_permitted5(),
    m.license_permitted6(),
  ]

  const prohibited = [
    m.license_prohibited1(),
    m.license_prohibited2(),
    m.license_prohibited3(),
    m.license_prohibited4(),
    m.license_prohibited5(),
    m.license_prohibited6(),
  ]

  const contactFirst = [
    m.license_contact_first1(),
    m.license_contact_first2(),
    m.license_contact_first3(),
    m.license_contact_first4(),
    m.license_contact_first5(),
    m.license_contact_first6(),
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-linear-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <Scale className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              {m.license_title()}
            </h1>
            <p className="text-xl text-slate-600">
              {m.license_subtitle()}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              {m.license_summary_title()}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Permitted */}
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-emerald-900">{m.license_permitted_title()}</h3>
                </div>
                <ul className="space-y-2">
                  {permitted.map((item, index) => (
                    <li key={index} className="text-sm text-emerald-800 flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited */}
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-red-900">{m.license_prohibited_title()}</h3>
                </div>
                <ul className="space-y-2">
                  {prohibited.map((item, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact First */}
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-amber-900">{m.license_contact_first_title()}</h3>
                </div>
                <ul className="space-y-2">
                  {contactFirst.map((item, index) => (
                    <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
              <p className="text-blue-900 font-semibold mb-2">
                {m.license_questions_text()}
              </p>
              <a
                href="mailto:hello@sting9.org"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                hello@sting9.org
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* License Details */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
            <h2 className="text-h2 font-bold text-slate-900 mb-8">{m.license_full_title()}</h2>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_definitions_title()}</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-700">{m.license_definitions_dataset()}</p>
                </div>

                <div>
                  <p className="text-slate-700">{m.license_definitions_use()}</p>
                </div>

                <div>
                  <p className="text-slate-700">{m.license_definitions_commercial()}</p>
                </div>

                <div>
                  <p className="text-slate-700">{m.license_definitions_noncommercial()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_grant_title()}</h3>
              <p className="text-slate-700 mb-3">{m.license_grant_text()}</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>{m.license_grant1()}</li>
                <li>{m.license_grant2()}</li>
                <li>{m.license_grant3()}</li>
                <li>{m.license_grant4()}</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_conditions_title()}</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900">{m.license_conditions_attribution_title()}</h4>
                  <p className="text-slate-700 mb-2">{m.license_conditions_attribution_text()}</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>{m.license_conditions_attribution1()}</li>
                    <li>{m.license_conditions_attribution2()}</li>
                    <li>{m.license_conditions_attribution3()}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">{m.license_conditions_sharealike_title()}</h4>
                  <p className="text-slate-700 mb-2">{m.license_conditions_sharealike_text()}</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>{m.license_conditions_sharealike1()}</li>
                    <li>{m.license_conditions_sharealike2()}</li>
                    <li>{m.license_conditions_sharealike3()}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_restrictions_title()}</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-700 mb-2">{m.license_restrictions_intro()}</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>{m.license_restrictions1()}</li>
                    <li>{m.license_restrictions2()}</li>
                    <li>{m.license_restrictions3()}</li>
                    <li>{m.license_restrictions4()}</li>
                    <li>{m.license_restrictions5()}</li>
                    <li>{m.license_restrictions6()}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_commercial_title()}</h3>
              <p className="text-slate-700 mb-4">
                {m.license_commercial_text()}
              </p>
              <p className="text-slate-700 mb-2">{m.license_commercial_contact()}</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>{m.license_commercial1()}</li>
                <li>{m.license_commercial2()}</li>
                <li>{m.license_commercial3()}</li>
                <li>{m.license_commercial4()}</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_disclaimer_title()}</h3>
              <p className="text-slate-700 font-semibold">
                {m.license_disclaimer_text()}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{m.license_questions_title()}</h3>
              <p className="text-slate-700 mb-4">
                {m.license_questions_text()}
              </p>
              <p className="text-slate-700"><strong>{m.license_questions_licensing()}</strong> <a href="mailto:licensing@sting9.org" className="text-blue-600 hover:text-blue-700">licensing@sting9.org</a></p>
              <p className="text-slate-700"><strong>{m.license_questions_general()}</strong> <a href="mailto:hello@sting9.org" className="text-blue-600 hover:text-blue-700">hello@sting9.org</a></p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
