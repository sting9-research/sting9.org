import { createFileRoute } from '@tanstack/react-router'
import { Shield, Lock, Database, Eye, Globe, Mail } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/privacy')({ component: PrivacyPage })

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              Effective Date: November 12, 2025
            </p>
            <p className="text-lg text-slate-600">
              At Sting9, your privacy is our top priority. We are committed to protecting your personal information
              and handling submitted phishing data with the utmost care.
            </p>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-h2 font-bold text-slate-900 mb-12 text-center">
              Our Privacy Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <Lock className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Privacy First</h3>
                <p className="text-emerald-800">
                  All submissions are automatically anonymized. No personal data is stored.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <Eye className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-3">No Tracking</h3>
                <p className="text-blue-800">
                  We don't track who submits messages. Anonymous contributions are welcome.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <Globe className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-purple-900 mb-3">GDPR Compliant</h3>
                <p className="text-purple-800">
                  We comply with GDPR, CCPA, and international privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Who We Are */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Who We Are</h3>
              <p className="text-slate-700 mb-4">
                Sting9 Research Initiative is operated by <strong>nlsio LLC</strong> (change of status planned).
                We are building the world's most comprehensive open-source dataset of phishing and smishing messages
                to train AI models for detecting malicious communications.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700"><strong>Contact:</strong></p>
                <p className="text-slate-700">Email: <a href="mailto:hello@sting9.org" className="text-blue-600 hover:text-blue-700">hello@sting9.org</a></p>
                <p className="text-slate-700">Data Protection Officer: <a href="mailto:privacy@sting9.org" className="text-blue-600 hover:text-blue-700">privacy@sting9.org</a></p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h3>

              <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">2.1 Submitted Phishing/Scam Messages</h4>
              <p className="text-slate-700 mb-4">
                When you submit a suspicious message to Sting9, we collect:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Message Content:</strong> The full text of the email, SMS, or other message (automatically anonymized before storage)</li>
                <li><strong>Message Metadata:</strong> Subject lines, timestamps, sender domains (but NOT full email addresses or phone numbers)</li>
                <li><strong>Message Headers:</strong> Technical routing information with personal identifiers removed</li>
                <li><strong>Message Type:</strong> Whether it's an email, SMS, WhatsApp, Telegram, Signal, or other format</li>
                <li><strong>Submission Source:</strong> How the message was submitted (web form, email forward, API, partner)</li>
                <li><strong>Detected Language:</strong> The language of the message content</li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-800 font-semibold">
                  ✓ IMPORTANT: All personally identifiable information (PII) is automatically redacted BEFORE storage.
                </p>
                <p className="text-green-700 mt-2">
                  This includes: email addresses, phone numbers, names, street addresses, credit card numbers, social security numbers,
                  IP addresses, and any other identifiable information.
                </p>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">2.2 Website Usage Data</h4>
              <p className="text-slate-700 mb-2">We collect minimal technical data to operate our website:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Basic server logs (timestamps, HTTP requests) - retained for 30 days</li>
                <li>Error logs for debugging - retained for 90 days</li>
                <li>No cookies, tracking pixels, or analytics tools</li>
                <li>No third-party advertising or tracking</li>
              </ul>

              <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">2.3 Information We DO NOT Collect</h4>
              <p className="text-slate-700 mb-2">We explicitly DO NOT collect or retain:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Your identity or contact information (unless you explicitly provide it for partnership inquiries)</li>
                <li>IP addresses of website visitors or submitters</li>
                <li>Device fingerprints or tracking identifiers</li>
                <li>Browsing history or behavioral data</li>
                <li>Any personal information from the phishing messages you submit</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h3>

              <h4 className="text-xl font-bold text-slate-900 mb-3">3.1 Submitted Messages</h4>
              <p className="text-slate-700 mb-2">Anonymized message data is used to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Build and train AI models for phishing detection</li>
                <li>Create an open-source dataset for security researchers</li>
                <li>Analyze attack patterns and trends</li>
                <li>Improve our detection algorithms</li>
                <li>Generate public statistics about phishing threats</li>
              </ul>

              <h4 className="text-xl font-bold text-slate-900 mb-3">3.2 Technical Data</h4>
              <p className="text-slate-700 mb-2">Basic technical data is used only to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Operate and maintain our website</li>
                <li>Debug technical issues</li>
                <li>Prevent abuse and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Data Storage and Security */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Data Storage and Security</h3>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-blue-900 font-semibold mb-2">Data Hosting</p>
                <p className="text-blue-800">
                  All data is hosted on <strong>Upsun</strong> infrastructure in the <strong>Switzerland region</strong>,
                  benefiting from Switzerland's strong data protection laws.
                </p>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-3">Security Measures:</h4>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest</li>
                <li><strong>Automatic PII Redaction:</strong> Personal information is removed before database storage using regex patterns and NER (Named Entity Recognition)</li>
                <li><strong>Access Controls:</strong> Strict row-level security and role-based access in PostgreSQL</li>
                <li><strong>Audit Logging:</strong> All data access is logged and monitored</li>
                <li><strong>Regular Backups:</strong> Automated encrypted backups with 30-day retention</li>
                <li><strong>Security Updates:</strong> Regular security patches and vulnerability scanning</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Data Sharing and Disclosure</h3>

              <h4 className="text-xl font-bold text-slate-900 mb-3">5.1 Open Dataset</h4>
              <p className="text-slate-700 mb-4">
                Anonymized message data is made publicly available under the ODC-BY-NC license for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Academic researchers</li>
                <li>Security professionals</li>
                <li>Non-profit organizations</li>
                <li>Educational institutions</li>
              </ul>

              <h4 className="text-xl font-bold text-slate-900 mb-3">5.2 No Sale of Data</h4>
              <p className="text-slate-700 mb-4">
                We DO NOT and WILL NEVER sell your personal information or the phishing data you submit.
              </p>

              <h4 className="text-xl font-bold text-slate-900 mb-3">5.3 Legal Requirements</h4>
              <p className="text-slate-700">
                We may disclose information only if required by law, court order, or to protect our legal rights.
                However, since we don't collect personal information, there is minimal data to disclose.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Your Privacy Rights</h3>

              <p className="text-slate-700 mb-4">
                Under GDPR, CCPA, and other privacy laws, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Access:</strong> Request information about data we may have (though we don't link data to identities)</li>
                <li><strong>Deletion:</strong> Request deletion of specific submissions (if you can identify them)</li>
                <li><strong>Portability:</strong> Export data in machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              </ul>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 font-semibold mb-2">To Exercise Your Rights:</p>
                <p className="text-slate-700">Email: <a href="mailto:privacy@sting9.org" className="text-blue-600 hover:text-blue-700">privacy@sting9.org</a></p>
                <p className="text-slate-700 text-sm mt-2">
                  Note: Since submissions are anonymous, you may need to provide the submission ID to identify specific data.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h3>

              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Anonymized Messages:</strong> Retained indefinitely for research purposes (as they contain no personal information)</li>
                <li><strong>Server Logs:</strong> 30 days</li>
                <li><strong>Error Logs:</strong> 90 days</li>
                <li><strong>Backup Data:</strong> 30 days</li>
              </ul>
            </div>

            {/* International Transfers */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">8. International Data Transfers</h3>
              <p className="text-slate-700">
                Our data is hosted in Switzerland and is not transferred outside of Switzerland except when accessed
                via our API by authorized researchers worldwide. Since all data is anonymized, international transfers
                do not pose privacy risks.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h3>
              <p className="text-slate-700">
                Our service is not directed at children under 13. We do not knowingly collect personal information
                from children. If you believe a child has submitted personal information, please contact us at{' '}
                <a href="mailto:privacy@sting9.org" className="text-blue-600 hover:text-blue-700">privacy@sting9.org</a>.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Policy</h3>
              <p className="text-slate-700">
                We may update this Privacy Policy from time to time. We will notify users of material changes by:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Effective Date" at the top</li>
                <li>Sending notice to registered partners (if applicable)</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">Contact Us</h3>
              </div>
              <p className="text-slate-300 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-white"><strong>General Inquiries:</strong> <a href="mailto:hello@sting9.org" className="text-emerald-400 hover:text-emerald-300">hello@sting9.org</a></p>
                <p className="text-white"><strong>Privacy Officer:</strong> <a href="mailto:privacy@sting9.org" className="text-emerald-400 hover:text-emerald-300">privacy@sting9.org</a></p>
                <p className="text-slate-300 mt-4">Sting9 Research Initiative<br/>Operated by nlsio LLC</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
