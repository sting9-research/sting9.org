import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, XCircle, AlertTriangle, Scale } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/license')({ component: LicensePage })

function LicensePage() {
  const permitted = [
    'University research → open access publication',
    'Non-profit public security study → free report',
    'Government agency analysis → public dataset',
    'Classroom teaching and free online courses',
    'Academic benchmarks (freely published)',
  ]

  const prohibited = [
    'Startup using data for product development',
    'Publishing in Nature (paywall) without permission',
    'Sponsored research with IP restrictions',
    'Training commercial AI models',
    'Commercial consulting services',
  ]

  const contactFirst = [
    'Industry partnership with open publication',
    'Non-profit with revenue-generating activities',
    'Hybrid academic-industry projects',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <Scale className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Dataset License Agreement
            </h1>
            <p className="text-xl text-slate-600">
              Based on Open Data Commons Attribution-NonCommercial (ODC-BY-NC) with Clarifications
            </p>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              Quick Reference Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Permitted */}
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-emerald-900">Permitted</h3>
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
                  <h3 className="text-xl font-bold text-red-900">Prohibited</h3>
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
                  <h3 className="text-xl font-bold text-amber-900">Contact First</h3>
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
                Questions or need a commercial license?
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
            <h2 className="text-h2 font-bold text-slate-900 mb-8">License Terms</h2>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Definitions</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900">"Dataset"</h4>
                  <p className="text-slate-700">means the collection of data made available under this license.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">"Commercial Use"</h4>
                  <p className="text-slate-700 mb-2">means any use primarily intended for or directed toward commercial advantage or monetary compensation, including but not limited to:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Use by for-profit entities in their business operations</li>
                    <li>Use in developing commercial products or services</li>
                    <li>Use in industry-sponsored research where the sponsor retains commercial rights to results</li>
                    <li>Publication of results or derivatives behind paywalls or subscription services</li>
                    <li>Use to train AI/ML models for commercial products</li>
                    <li>Consulting services using this Dataset</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">"Non-Commercial Use"</h4>
                  <p className="text-slate-700 mb-2">means use that meets ALL of the following criteria:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Primary purpose is academic research, education, or public benefit</li>
                    <li>Results are made freely and publicly available without access restrictions</li>
                    <li>No monetary compensation is derived from the use</li>
                    <li>If sponsored, sponsor cannot be a for-profit entity unless they waive all commercial rights</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">"Permitted Entities"</h4>
                  <p className="text-slate-700 mb-2">include:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Accredited educational institutions (for truly non-commercial research)</li>
                    <li>Registered non-profit organizations</li>
                    <li>Government agencies and public institutions</li>
                    <li>Independent researchers publishing in open access venues</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Grant of Rights</h3>
              <p className="text-slate-700 mb-3">You are free to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Share:</strong> Copy and redistribute the Dataset</li>
                <li><strong>Adapt:</strong> Modify, transform, and build upon the Dataset</li>
                <li><strong>Use:</strong> Use the Dataset for Non-Commercial purposes</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Conditions</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900">Attribution</h4>
                  <p className="text-slate-700 mb-2">You must give appropriate credit, provide a link to this license, and indicate if changes were made. Include:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Dataset name and version</li>
                    <li>Original source/creator</li>
                    <li>Link to original Dataset</li>
                    <li>Statement: "Used under ODC-BY-NC with clarifications"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Non-Commercial</h4>
                  <p className="text-slate-700">You may not use the Dataset for Commercial Use as defined above.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Open Results</h4>
                  <p className="text-slate-700 mb-2">Any research, publications, or derivatives must be:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Published in open access venues (no paywalls)</li>
                    <li>Made freely available to the public</li>
                    <li>Released under compatible open licenses</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Specific Restrictions</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-red-700">Prohibited Uses:</h4>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Publishing research results in journals requiring payment or subscription for access</li>
                    <li>Industry-sponsored research where sponsor retains exclusive rights, patents, or commercial control over findings</li>
                    <li>Training proprietary AI/ML models for commercial deployment</li>
                    <li>Use by commercial entities, even for "research purposes," unless approved in writing</li>
                    <li>Sublicensing with commercial terms</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Paywalled Publications:</h4>
                  <p className="text-slate-700 mb-2">You may NOT publish results derived from this Dataset in venues that require payment, subscription, or institutional access.</p>
                  <p className="text-slate-700 mb-2">Permitted:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>Preprint servers (arXiv, bioRxiv, etc.)</li>
                    <li>Open access journals with author fees (APCs) if final publication is freely accessible</li>
                    <li>Conference proceedings only if freely available online</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Industry-Sponsored Research:</h4>
                  <p className="text-slate-700 mb-2">Permitted ONLY if:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>All results remain in public domain</li>
                    <li>Sponsor waives all commercial rights in writing</li>
                    <li>Sponsor cannot restrict publication or use of findings</li>
                    <li>Results published in open access venues</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Commercial Licensing</h3>
              <p className="text-slate-700 mb-4">
                For Commercial Use, contact <a href="mailto:hello@sting9.org" className="text-blue-600 hover:text-blue-700 font-semibold">hello@sting9.org</a> to obtain a separate commercial license.
              </p>
              <p className="text-slate-700 mb-2">Commercial licenses are available for:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>For-profit research and development</li>
                <li>Commercial product development</li>
                <li>Industry-sponsored research with commercial rights</li>
                <li>Proprietary AI/ML model training</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Disclaimer and Limitation of Liability</h3>
              <p className="text-slate-700 font-semibold">
                THE DATASET IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. IN NO EVENT SHALL THE LICENSOR BE LIABLE FOR ANY CLAIM, DAMAGES, OR LIABILITY ARISING FROM USE OF THE DATASET.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Recommended Citation</h3>
              <div className="bg-slate-100 rounded-lg p-4 font-mono text-sm text-slate-800">
                <pre>
{`Sting9 Research Initiative. (2025).
Sting9 Anti-Phishing Dataset.
Licensed under ODC-BY-NC with clarifications.
Available from: https://sting9.org/`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container-custom text-center">
          <h3 className="text-2xl font-bold mb-4">
            Questions About Licensing?
          </h3>
          <p className="text-slate-300 mb-6">
            We're happy to clarify any questions or discuss commercial licensing options.
          </p>
          <a
            href="mailto:hello@sting9.org"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
          >
            Contact Us About Licensing
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
