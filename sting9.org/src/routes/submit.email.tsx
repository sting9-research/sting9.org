import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, AlertTriangle, CheckCircle2, Send, ArrowRight, Shield, Info } from 'lucide-react'

export const Route = createFileRoute('/submit/email')({
  component: SubmitEmailPage,
})

function SubmitEmailPage() {
  const [formData, setFormData] = useState({
    content: '',
    submitter_email: '',
    submitter_nickname: '',
    from: '',
    to: '',
    subject: '',
    date: '',
    attachments: '',
    urls: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare submission payload
      const submission = {
        type: 'email',
        content: formData.content,
        submitter_email: formData.submitter_email || undefined,
        submitter_nickname: formData.submitter_nickname || undefined,
        metadata: {
          from: formData.from || undefined,
          to: formData.to || undefined,
          subject: formData.subject || undefined,
          date: formData.date || undefined,
          attachments: formData.attachments ? formData.attachments.split(',').map(a => a.trim()) : undefined,
          urls: formData.urls ? formData.urls.split(',').map(u => u.trim()) : undefined,
        }
      }

      // TODO: Replace with actual API endpoint when backend is ready
      const response = await fetch('https://api.sting9.org/api/v1/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit email')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="mb-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Email Submitted Successfully!
          </h2>
          <p className="text-slate-600 mb-6">
            Thank you for contributing to the Sting9 dataset. Your submission will be anonymized and processed to help train AI models that detect phishing emails.
          </p>
          <div className="space-y-3">
            <a
              href="/submit/email"
              className="block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Submit Another Email
            </a>
            <a
              href="/"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-slate-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Mail className="w-4 h-4" />
              <span>Email Submission</span>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Submit a Suspicious Email
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Help us build the world's most comprehensive phishing detection dataset. Submit suspicious emails you've received to contribute to AI training.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom section-spacing">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Information Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              What to Submit
            </h2>

            <div className="space-y-6">
              {/* Email Types */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-600" />
                  Email Types We Collect
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Phishing emails (fake banks, companies)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Spear-phishing (targeted attacks)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Business Email Compromise (BEC)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Romance or lottery scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Tax/IRS impersonation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Malware delivery attempts</span>
                  </li>
                </ul>
              </div>

              {/* Privacy Notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-sm mb-1">
                      Your Privacy is Protected
                    </h3>
                    <p className="text-emerald-700 text-sm">
                      All personal information (emails, names, phone numbers, addresses) is automatically anonymized before being added to the dataset.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-2">
                      Submission Guidelines
                    </h3>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Copy the full email content</li>
                      <li>• Include headers if available</li>
                      <li>• Note any suspicious links or attachments</li>
                      <li>• Submit one email per form</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Alternative Method */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Alternative Method
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  You can also forward suspicious emails directly to:
                </p>
                <a
                  href="mailto:submit@sting9.org"
                  className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  submit@sting9.org
                </a>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Email Details
              </h2>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 text-sm mb-1">Submission Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Content - REQUIRED */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Content <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={10}
                    minLength={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    placeholder="Paste the full email content here, including headers if possible..."
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    Required • Minimum 10 characters • Include full message body
                  </p>
                </div>

                {/* Submitter Information */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Your Information (Optional)
                  </h3>

                  <div className="space-y-4">
                    {/* Submitter Email */}
                    <div>
                      <label htmlFor="submitter_email" className="block text-sm font-medium text-slate-700 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="submitter_email"
                        name="submitter_email"
                        value={formData.submitter_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Optional • We may contact you if we have questions about this submission
                      </p>
                    </div>

                    {/* Submitter Nickname */}
                    <div>
                      <label htmlFor="submitter_nickname" className="block text-sm font-medium text-slate-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="submitter_nickname"
                        name="submitter_nickname"
                        value={formData.submitter_nickname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Your name or nickname"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Optional • For recognition on our contributor leaderboard
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Optional Details (Helps with Analysis)
                  </h3>

                  <div className="space-y-4">
                    {/* From */}
                    <div>
                      <label htmlFor="from" className="block text-sm font-medium text-slate-700 mb-2">
                        From Address
                      </label>
                      <input
                        type="text"
                        id="from"
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="sender@example.com or Display Name <sender@example.com>"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="The email subject line"
                      />
                    </div>

                    {/* To */}
                    <div>
                      <label htmlFor="to" className="block text-sm font-medium text-slate-700 mb-2">
                        To Address
                      </label>
                      <input
                        type="text"
                        id="to"
                        name="to"
                        value={formData.to}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="recipient@example.com"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                        Date Received
                      </label>
                      <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Suspicious URLs */}
                    <div>
                      <label htmlFor="urls" className="block text-sm font-medium text-slate-700 mb-2">
                        Suspicious Links/URLs
                      </label>
                      <textarea
                        id="urls"
                        name="urls"
                        rows={3}
                        value={formData.urls}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter suspicious URLs, one per line or comma-separated"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Comma-separated list of URLs found in the email
                      </p>
                    </div>

                    {/* Attachments */}
                    <div>
                      <label htmlFor="attachments" className="block text-sm font-medium text-slate-700 mb-2">
                        Attachment Names
                      </label>
                      <input
                        type="text"
                        id="attachments"
                        name="attachments"
                        value={formData.attachments}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="invoice.pdf, document.zip (do not upload actual files)"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Comma-separated list of attachment filenames (do not upload the actual files)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-700">
                    By submitting this email, you confirm that you are contributing to an open-source research dataset and understand that the anonymized data will be released under the{' '}
                    <a href="/license" className="text-amber-600 hover:text-amber-700 underline">
                      ODC-BY-NC license
                    </a>
                    . All personal information will be automatically redacted before publication.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <a
                    href="/"
                    className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </a>
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.content.length < 10}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What Happens Next?
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">1</div>
                  <p>Your email is automatically scanned and all personal information is redacted</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">2</div>
                  <p>AI models analyze the content to categorize the threat type</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">3</div>
                  <p>The anonymized email is added to the public dataset for AI training</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">4</div>
                  <p>Researchers worldwide use this data to build better phishing detection systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
