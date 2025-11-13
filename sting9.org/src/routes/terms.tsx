import { createFileRoute } from '@tanstack/react-router'
import { FileText, Shield, AlertTriangle, Scale, Mail } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/terms')({ component: TermsPage })

function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              Effective Date: November 12, 2025
            </p>
            <p className="text-lg text-slate-600">
              Please read these terms carefully before using the Sting9 Research Initiative platform.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Acceptance of Terms */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h3>
              <p className="text-slate-700 mb-4">
                By accessing or using the Sting9 Research Initiative website (sting9.org), submitting messages,
                or accessing our dataset or API, you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use our services.
              </p>
              <p className="text-slate-700">
                These Terms constitute a legally binding agreement between you and <strong>nlsio LLC</strong> (change of status planned),
                the operator of the Sting9 Research Initiative.
              </p>
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Service Description</h3>
              <p className="text-slate-700 mb-4">
                Sting9 Research Initiative provides a platform for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Submitting suspected phishing, smishing, and scam messages for research purposes</li>
                <li>Building an open-source dataset of malicious communications</li>
                <li>Training AI models to detect digital deception</li>
                <li>Providing dataset access to researchers, academics, and security professionals</li>
                <li>Offering educational content about phishing and smishing threats</li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 font-semibold mb-2">Data Hosting</p>
                <p className="text-blue-800">
                  All data is hosted on <strong>Upsun</strong> infrastructure in the <strong>Switzerland region</strong>,
                  subject to Swiss data protection laws and regulations.
                </p>
              </div>
            </div>

            {/* User Obligations */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. User Obligations</h3>

              <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.1 Accurate Submissions</h4>
              <p className="text-slate-700 mb-2">When submitting messages, you agree to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Submit only messages you genuinely believe to be phishing, smishing, or scam attempts</li>
                <li>Provide accurate metadata and context where requested</li>
                <li>Not submit legitimate business communications as fraudulent</li>
                <li>Not submit copyrighted content unless you have the right to do so</li>
              </ul>

              <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.2 Prohibited Activities</h4>
              <p className="text-slate-700 mb-2">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Abuse or overload our submission system with spam or automated submissions (unless authorized)</li>
                <li>Attempt to reverse-engineer, hack, or compromise our platform's security</li>
                <li>Submit messages containing child exploitation material or other illegal content</li>
                <li>Use our dataset or API in violation of the ODC-BY-NC license terms</li>
                <li>Misrepresent your affiliation with Sting9 or use our name without permission</li>
                <li>Submit false or misleading information to gain unauthorized access to our services</li>
              </ul>

              <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.3 Responsible Use</h4>
              <p className="text-slate-700">
                Users accessing our dataset or API agree to use it responsibly and ethically, in accordance with
                applicable laws and the ODC-BY-NC license. Commercial use requires a separate license agreement.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property</h3>

              <h4 className="text-xl font-bold text-slate-900 mb-3">4.1 Dataset License</h4>
              <p className="text-slate-700 mb-4">
                The Sting9 dataset is released under the <strong>Open Data Commons Attribution-NonCommercial (ODC-BY-NC) license</strong> with clarifications.
                See our <a href="/license" className="text-blue-600 hover:text-blue-700 font-semibold">License page</a> for full details.
              </p>

              <h4 className="text-xl font-bold text-slate-900 mb-3">4.2 Submitted Content</h4>
              <p className="text-slate-700 mb-2">
                By submitting messages to Sting9, you grant us:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>A worldwide, perpetual, irrevocable, royalty-free license to use, modify, and distribute the submitted content</li>
                <li>The right to anonymize and include the content in our public dataset</li>
                <li>The right to use the content for training AI models and research purposes</li>
              </ul>
              <p className="text-slate-700 mb-4">
                You represent that you have the right to submit the content and grant these licenses.
              </p>

              <h4 className="text-xl font-bold text-slate-900 mb-3">4.3 Website Content</h4>
              <p className="text-slate-700">
                All content on the Sting9 website (text, graphics, logos, design) is owned by nlsio LLC or its licensors
                and is protected by copyright and trademark laws. You may not copy, reproduce, or distribute website content
                without permission, except for personal, non-commercial use.
              </p>
            </div>

            {/* Privacy and Data Protection */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Privacy and Data Protection</h3>
              <p className="text-slate-700 mb-4">
                We are committed to protecting your privacy. Please review our{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">Privacy Policy</a> to
                understand how we collect, use, and protect your information.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-800 font-semibold mb-2">
                  Key Privacy Highlights:
                </p>
                <ul className="list-disc pl-6 text-green-700 space-y-1">
                  <li>We do not track who submits messages</li>
                  <li>All personal information is automatically redacted before storage</li>
                  <li>Submissions are anonymous by default</li>
                  <li>We comply with GDPR and Swiss data protection laws</li>
                </ul>
              </div>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Disclaimer of Warranties</h3>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <p className="text-amber-900 font-semibold mb-2">
                  ⚠ IMPORTANT DISCLAIMER
                </p>
                <p className="text-amber-800">
                  The Sting9 platform, dataset, and API are provided on an "AS IS" and "AS AVAILABLE" basis.
                </p>
              </div>
              <p className="text-slate-700 mb-2">
                We make NO WARRANTIES, express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Accuracy:</strong> We do not guarantee the accuracy, completeness, or reliability of submitted messages or our dataset</li>
                <li><strong>Availability:</strong> We do not guarantee uninterrupted or error-free service</li>
                <li><strong>Security:</strong> While we implement security measures, we cannot guarantee absolute security</li>
                <li><strong>Detection Capability:</strong> Our AI models and dataset do not guarantee detection of all phishing attempts</li>
                <li><strong>Fitness for Purpose:</strong> We do not warrant that our services will meet your specific requirements</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h3>
              <p className="text-slate-700 mb-4 font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, nlsio LLC AND THE STING9 RESEARCH INITIATIVE SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages arising from reliance on our dataset or AI models</li>
                <li>Damages resulting from unauthorized access to or use of our servers or data</li>
                <li>Damages arising from errors, omissions, or inaccuracies in submitted messages or our dataset</li>
                <li>Any claims by third parties related to submitted content</li>
              </ul>
              <p className="text-slate-700">
                In jurisdictions that do not allow the exclusion of certain warranties or limitation of liability,
                our liability shall be limited to the maximum extent permitted by law.
              </p>
            </div>

            {/* Indemnification */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">8. Indemnification</h3>
              <p className="text-slate-700 mb-2">
                You agree to indemnify, defend, and hold harmless nlsio LLC, Sting9 Research Initiative, and their
                officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses
                (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Your use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your submission of content that infringes on third-party rights</li>
                <li>Your violation of any applicable laws or regulations</li>
              </ul>
            </div>

            {/* Termination */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">9. Termination</h3>
              <p className="text-slate-700 mb-4">
                We reserve the right to suspend or terminate your access to our services at any time, without notice,
                for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Submission of inappropriate or harmful content</li>
                <li>Unauthorized commercial use of our dataset or API</li>
              </ul>
              <p className="text-slate-700">
                Termination does not affect previously granted licenses for submitted content or dataset usage
                under the ODC-BY-NC license.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">10. Governing Law and Jurisdiction</h3>
              <p className="text-slate-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of <strong>Switzerland</strong>,
                without regard to its conflict of law provisions.
              </p>
              <p className="text-slate-700 mb-4">
                Any disputes arising from these Terms or your use of Sting9 services shall be subject to the
                exclusive jurisdiction of the courts of Switzerland.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 font-semibold mb-2">Data Protection Authority</p>
                <p className="text-blue-800">
                  For data protection concerns, you may contact the Swiss Federal Data Protection and Information Commissioner (FDPIC).
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to These Terms</h3>
              <p className="text-slate-700 mb-2">
                We may update these Terms from time to time. We will notify users of material changes by:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mb-4">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Effective Date" at the top</li>
                <li>Sending notice to registered API users (if applicable)</li>
              </ul>
              <p className="text-slate-700">
                Your continued use of our services after changes become effective constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">Contact Us</h3>
              </div>
              <p className="text-slate-300 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-white"><strong>General Inquiries:</strong> <a href="mailto:hello@sting9.org" className="text-emerald-400 hover:text-emerald-300">hello@sting9.org</a></p>
                <p className="text-white"><strong>Legal:</strong> <a href="mailto:legal@sting9.org" className="text-emerald-400 hover:text-emerald-300">legal@sting9.org</a></p>
                <p className="text-slate-300 mt-4">Sting9 Research Initiative<br/>Operated by nlsio LLC<br/>Data hosted in Switzerland</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
