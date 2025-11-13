import { createFileRoute } from '@tanstack/react-router'
import { Github, Code, Users, CheckCircle2, Info } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/dataset')({
  component: DatasetAccessPage,
})

function DatasetAccessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Dataset Access
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Access the world's largest open-source dataset of phishing, smishing, and scam messages. Available for researchers, developers, and organizations committed to fighting digital deception.
            </p>
          </div>
        </div>
      </section>

      {/* Access Types */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-slate-900 mb-4">
              Access Options
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Choose the access method that best fits your needs. All data is released under Creative Commons CC0 (Public Domain).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* GitHub Database Dump */}
            <div className="bg-white rounded-xl shadow-md border-2 border-amber-500 p-8">
              <div className="flex items-center mb-4">
                <Github className="w-8 h-8 text-amber-600 mr-3" />
                <h3 className="text-xl font-bold text-slate-900">
                  GitHub Dump
                </h3>
              </div>
              <p className="text-slate-600 mb-6">
                Full PostgreSQL database dump with all anonymized submissions, updated weekly.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Complete dataset export</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">SQL format for easy import</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">No authentication required</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Weekly updates</span>
                </li>
              </ul>
              <a
                href="https://github.com/sting9/dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Download from GitHub
              </a>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Best for: Researchers, bulk analysis, offline use
              </p>
            </div>

            {/* REST API */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-amber-600 mr-3" />
                <h3 className="text-xl font-bold text-slate-900">
                  REST API
                </h3>
              </div>
              <p className="text-slate-600 mb-6">
                Programmatic access to query and filter the dataset in real-time.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Real-time data access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Advanced filtering & search</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">OpenAPI documentation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Rate limits: 1000 req/hour</span>
                </li>
              </ul>
              <a
                href="/research"
                className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                View API Docs
              </a>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Best for: Applications, integrations, dynamic queries
              </p>
            </div>

            {/* Partner Access */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-amber-600 mr-3" />
                <h3 className="text-xl font-bold text-slate-900">
                  Partner Access
                </h3>
              </div>
              <p className="text-slate-600 mb-6">
                Enhanced access for academic institutions, security companies, and verified researchers.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Bulk submission API</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Higher rate limits</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Early access to new models</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Dedicated support</span>
                </li>
              </ul>
              <a
                href="/partners"
                className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Become a Partner
              </a>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Best for: Organizations, bulk contributors, researchers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Format & Schema */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8 text-center">
            Data Format & Schema
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Core Tables: Submissions
              </h3>
              <p className="text-slate-600 mb-6">
                The main <code className="bg-slate-100 px-2 py-1 rounded text-sm">submissions</code> table stores all phishing, smishing, and scam messages with anonymized content and metadata:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Field</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">submission_id</td>
                      <td className="px-4 py-3 text-sm text-slate-600">UUID</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Primary key, unique identifier</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">message_type</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(20)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">email, sms, whatsapp, telegram, signal, other</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">threat_level</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(20)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">low, medium, high, critical, unknown</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">attack_type</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(50)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">phishing, spear-phishing, smishing, BEC, romance_scam, etc.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">subject_text</td>
                      <td className="px-4 py-3 text-sm text-slate-600">TEXT</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Email subject or SMS preview (PII redacted)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">body_text</td>
                      <td className="px-4 py-3 text-sm text-slate-600">TEXT</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Message content (PII redacted)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">raw_headers</td>
                      <td className="px-4 py-3 text-sm text-slate-600">JSONB</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Email headers with PII removed</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">detected_language</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(10)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">ISO 639-1 language code (e.g., 'en', 'es', 'fr')</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">detected_country</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(2)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">ISO 3166-1 country code (e.g., 'US', 'GB')</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">sender_domain</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(255)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Sender domain (preserved for pattern analysis)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">sender_domain_hash</td>
                      <td className="px-4 py-3 text-sm text-slate-600">BYTEA</td>
                      <td className="px-4 py-3 text-sm text-slate-600">SHA-256 hash of full sender email</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">claimed_sender_name</td>
                      <td className="px-4 py-3 text-sm text-slate-600">VARCHAR(255)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Display name from sender (may be spoofed)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">message_timestamp</td>
                      <td className="px-4 py-3 text-sm text-slate-600">TIMESTAMPTZ</td>
                      <td className="px-4 py-3 text-sm text-slate-600">When message was originally sent</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">submission_timestamp</td>
                      <td className="px-4 py-3 text-sm text-slate-600">TIMESTAMPTZ</td>
                      <td className="px-4 py-3 text-sm text-slate-600">When submitted to Sting9</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">verified</td>
                      <td className="px-4 py-3 text-sm text-slate-600">BOOLEAN</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Manually verified as malicious</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">confidence_score</td>
                      <td className="px-4 py-3 text-sm text-slate-600">DECIMAL(3,2)</td>
                      <td className="px-4 py-3 text-sm text-slate-600">ML model confidence (0.00-1.00)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* URLs Table */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  URLs Table
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Extracted and analyzed URLs with threat intelligence:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">url_id</span>
                    <span className="text-slate-600">UUID primary key</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">full_url</span>
                    <span className="text-slate-600">Complete URL (defanged)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">domain</span>
                    <span className="text-slate-600">Domain name</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">threat_status</span>
                    <span className="text-slate-600">safe, suspicious, malicious</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">is_shortened</span>
                    <span className="text-slate-600">URL shortener detection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">blocklist_sources</span>
                    <span className="text-slate-600">Which blocklists flagged it</span>
                  </li>
                </ul>
              </div>

              {/* Attachments Table */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Attachments Table
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Metadata about file attachments (no file content stored):
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">attachment_id</span>
                    <span className="text-slate-600">UUID primary key</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">filename</span>
                    <span className="text-slate-600">Original filename</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">file_hash</span>
                    <span className="text-slate-600">SHA-256 hash</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">mime_type</span>
                    <span className="text-slate-600">File type</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">is_executable</span>
                    <span className="text-slate-600">Executable file detection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">malware_scan_result</span>
                    <span className="text-slate-600">clean, suspicious, malicious</span>
                  </li>
                </ul>
              </div>

              {/* Email Details */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Email Details Table
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Extended metadata for email messages:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">spf_result</span>
                    <span className="text-slate-600">SPF validation (pass/fail)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">dkim_result</span>
                    <span className="text-slate-600">DKIM signature validation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">dmarc_result</span>
                    <span className="text-slate-600">DMARC validation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">uses_url_shorteners</span>
                    <span className="text-slate-600">Contains bit.ly, tinyurl, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">uses_homoglyphs</span>
                    <span className="text-slate-600">Lookalike characters (paypa1.com)</span>
                  </li>
                </ul>
              </div>

              {/* SMS Details */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  SMS Details Table
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Extended metadata for SMS/text messages:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">message_length</span>
                    <span className="text-slate-600">Character count</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">sender_type</span>
                    <span className="text-slate-600">shortcode, longcode, alphanumeric</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">contains_url</span>
                    <span className="text-slate-600">Message includes URL</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mr-2">urgency_keywords</span>
                    <span className="text-slate-600">Contains urgent/immediate language</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-emerald-500">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Privacy Guarantee
                  </h3>
                  <p className="text-slate-600">
                    All personal information (email addresses, phone numbers, names, addresses, etc.) is automatically detected and redacted using advanced PII detection algorithms before being added to the dataset. URLs are defanged to prevent accidental clicks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8 text-center">
            Usage Examples
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Python Example */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
                </svg>
                Python with pandas
              </h3>
              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`import pandas as pd
import requests

# Using the API
response = requests.get(
    'https://api.sting9.org/v1/submissions',
    params={
        'message_type': 'email',
        'language': 'en',
        'limit': 1000
    }
)
df = pd.DataFrame(response.json())

# Or load from GitHub dump
df = pd.read_sql(
    'SELECT * FROM submissions',
    'postgresql://localhost/sting9'
)

# Analyze threat types
df['threat_type'].value_counts()`}</code>
              </pre>
            </div>

            {/* JavaScript Example */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
                </svg>
                JavaScript / Node.js
              </h3>
              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`// Using fetch API
const response = await fetch(
  'https://api.sting9.org/v1/submissions',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();

// Filter phishing emails
const phishingEmails = data.filter(
  item => item.threat_type === 'phishing' &&
          item.message_type === 'email'
);

console.log(
  \`Found \${phishingEmails.length} phishing emails\`
);`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* License & Terms */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-slate-900 mb-8 text-center">
            License & Terms of Use
          </h2>

          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Creative Commons CC0 (Public Domain)
            </h3>
            <p className="text-slate-600 mb-4">
              The Sting9 dataset is released under <strong>Creative Commons Zero (CC0)</strong>, dedicating it to the public domain. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
              <li>You can copy, modify, and distribute the dataset without asking permission</li>
              <li>You can use it for commercial or non-commercial purposes</li>
              <li>No attribution is required (though appreciated!)</li>
              <li>No warranty or liability is provided</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Ethical Use Guidelines
            </h3>
            <p className="text-slate-600 mb-4">
              While the data is public domain, we encourage ethical use:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
              <li><strong>Do not</strong> attempt to re-identify anonymized individuals</li>
              <li><strong>Do not</strong> use the data to create or improve malicious tools</li>
              <li><strong>Do</strong> use it to improve security and protect people</li>
              <li><strong>Do</strong> share your findings and improvements with the community</li>
            </ul>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-900 text-sm">
                <strong>Suggested Citation:</strong> Sting9 Research Initiative. (2025). Sting9 Phishing and Scam Message Dataset. Retrieved from https://sting9.org/dataset
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-slate-50 rounded-xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Download the dataset and start building better detection systems today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/sting9/dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
              >
                <Github className="w-5 h-5" />
                Download from GitHub
              </a>
              <a
                href="/research"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
              >
                <Code className="w-5 h-5" />
                View API Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
