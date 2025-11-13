import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MessageSquare, AlertTriangle, CheckCircle2, Send, Shield, Info, Phone } from 'lucide-react'

export const Route = createFileRoute('/submit/sms')({
  component: SubmitSMSPage,
})

function SubmitSMSPage() {
  const [formData, setFormData] = useState({
    content: '',
    phoneNumber: '',
    date: '',
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
        type: 'sms',
        content: formData.content,
        metadata: {
          phone_number: formData.phoneNumber || undefined,
          date: formData.date || undefined,
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
        throw new Error(errorData.message || 'Failed to submit SMS')
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
            SMS Submitted Successfully!
          </h2>
          <p className="text-slate-600 mb-6">
            Thank you for contributing to the Sting9 dataset. Your submission will be anonymized and processed to help train AI models that detect smishing attacks.
          </p>
          <div className="space-y-3">
            <a
              href="/submit/sms"
              className="block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Submit Another SMS
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
              <MessageSquare className="w-4 h-4" />
              <span>SMS Submission</span>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Submit a Suspicious Text Message
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Report smishing (SMS phishing) attempts to help us build better detection systems. Your contribution helps protect millions from text message scams.
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
              {/* SMS Types */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  SMS Types We Collect
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Fake package delivery notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Bank account security alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>IRS/tax scam messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Prize or lottery winning notices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Fake job offers or payment requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>Account verification or password reset scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>COVID-19 or health-related scams</span>
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
                      All phone numbers, names, addresses, and personal information are automatically anonymized before being added to the dataset.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 text-sm mb-1">
                      Smishing on the Rise
                    </h3>
                    <p className="text-red-700 text-sm mb-2">
                      Text message scams increased by 174% in 2024, with average losses of $2,100 per victim.
                    </p>
                    <p className="text-red-600 text-xs">
                      Your submission helps combat this growing threat.
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
                      Submission Tips
                    </h3>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Copy the exact message text</li>
                      <li>• Include any suspicious links</li>
                      <li>• Note the sender's number (optional)</li>
                      <li>• Submit one message per form</li>
                      <li>• Screenshots are welcome via email</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Common Smishing Examples
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-100 rounded p-3 border border-slate-200">
                    <p className="text-slate-700 italic">
                      "USPS: Your package is awaiting delivery. Update your address: [link]"
                    </p>
                  </div>
                  <div className="bg-slate-100 rounded p-3 border border-slate-200">
                    <p className="text-slate-700 italic">
                      "Bank Alert: Suspicious activity on your account. Verify immediately: [link]"
                    </p>
                  </div>
                  <div className="bg-slate-100 rounded p-3 border border-slate-200">
                    <p className="text-slate-700 italic">
                      "You've won $5,000! Claim your prize here: [link]"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Message Details
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
                {/* SMS Content - REQUIRED */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                    Text Message Content <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    minLength={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Paste the suspicious text message here..."
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    Required • Minimum 10 characters • Copy and paste the full message
                  </p>
                </div>

                {/* Optional Fields */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Optional Details (Helps with Analysis)
                  </h3>

                  <div className="space-y-4">
                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                        Sender's Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567 or short code"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Include country code if known. This will be anonymized.
                      </p>
                    </div>

                    {/* Date Received */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                        Date & Time Received
                      </label>
                      <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        When did you receive this message?
                      </p>
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
                        placeholder="Enter any suspicious URLs from the message, one per line or comma-separated"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Comma-separated list of URLs. Do not click on suspicious links!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 text-sm mb-1">
                        Safety Reminder
                      </h3>
                      <p className="text-amber-700 text-sm">
                        Do not click on any links in suspicious messages. Do not reply to the sender. Do not provide personal information. Just copy the text and submit it here.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-700">
                    By submitting this message, you confirm that you are contributing to an open-source research dataset and understand that the anonymized data will be released under the{' '}
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
                        Submit Message
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
                  <p>Your message is automatically scanned and all phone numbers and personal info are redacted</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">2</div>
                  <p>AI models analyze the content, URLs, and patterns to categorize the threat type</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">3</div>
                  <p>The anonymized SMS is added to the public dataset for AI training</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-xs">4</div>
                  <p>Mobile carriers and security companies use this data to block similar smishing attempts</p>
                </div>
              </div>
            </div>

            {/* Report to Carrier */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Also Report to Your Carrier
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                In addition to submitting here, forward spam texts to <strong>7726</strong> (SPAM). This helps carriers block the sender.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>AT&T, T-Mobile, Verizon:</strong> Forward to 7726</li>
                <li>• <strong>FTC:</strong> Forward to spam@uce.gov</li>
                <li>• <strong>Report online:</strong> <a href="https://reportfraud.ftc.gov" className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">ReportFraud.ftc.gov</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
