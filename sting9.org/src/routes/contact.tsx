import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Phone, MapPin, Github, CheckCircle2, Send, ArrowRight } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

type InquiryType = 'general' | 'research' | 'media' | 'partnership' | 'technical' | 'data_request' | 'bug_report' | 'other'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '' as InquiryType | '',
    subject: '',
    message: '',
    urgency: 'normal' as 'low' | 'normal' | 'high',
    subscribeNewsletter: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Integrate with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="mb-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Message Sent Successfully!
          </h2>
          <p className="text-slate-600 mb-6">
            Thank you for reaching out to Sting9. We've received your message and will respond within 24-48 hours.
          </p>
          <a
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Home
          </a>
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
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Have questions, feedback, or want to learn more about Sting9? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom section-spacing">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Email Contacts */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Email Us
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@sting9.org"
                    className="flex items-start text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                    <div>
                      <div className="font-medium text-slate-900">General Inquiries</div>
                      <div className="text-sm">hello@sting9.org</div>
                    </div>
                  </a>

                  <a
                    href="mailto:research@sting9.org"
                    className="flex items-start text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                    <div>
                      <div className="font-medium text-slate-900">Research Inquiries</div>
                      <div className="text-sm">research@sting9.org</div>
                    </div>
                  </a>

                  <a
                    href="mailto:partners@sting9.org"
                    className="flex items-start text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                    <div>
                      <div className="font-medium text-slate-900">Partnerships</div>
                      <div className="text-sm">partners@sting9.org</div>
                    </div>
                  </a>

                  <a
                    href="mailto:press@sting9.org"
                    className="flex items-start text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                    <div>
                      <div className="font-medium text-slate-900">Media & Press</div>
                      <div className="text-sm">press@sting9.org</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Submit Suspicious Messages */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Send className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900 text-sm mb-1">
                      Submit Suspicious Messages
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      To contribute to the dataset, use our submission portal:
                    </p>
                    <div className="space-y-1">
                      <a href="/submit" className="text-amber-600 hover:text-amber-700 text-sm block flex items-center">
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Web Submission Form
                      </a>
                      <a href="mailto:submit@sting9.org" className="text-amber-600 hover:text-amber-700 text-sm block flex items-center">
                        <ArrowRight className="w-4 h-4 mr-1" />
                        submit@sting9.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/sting9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/sting9org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/sting9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Response Time
                </h3>
                <p className="text-sm text-slate-600">
                  We typically respond to inquiries within <strong>24-48 hours</strong> during business days. For urgent matters, please indicate this in your message.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-2">
                    Organization (Optional)
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Your company or institution"
                  />
                </div>

                {/* Inquiry Type and Urgency */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-slate-700 mb-2">
                      Inquiry Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select type...</option>
                      <option value="general">General Inquiry</option>
                      <option value="research">Research & Academic</option>
                      <option value="media">Media & Press</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="technical">Technical Support</option>
                      <option value="data_request">Data Access Request</option>
                      <option value="bug_report">Bug Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-slate-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="low">Low - Can wait a few days</option>
                      <option value="normal">Normal - Standard response time</option>
                      <option value="high">High - Need quick response</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Brief summary of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Please provide as much detail as possible..."
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    Minimum 10 characters. Be as specific as possible.
                  </p>
                </div>

                {/* Newsletter Subscription */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                    />
                    <span className="ml-3 text-sm text-slate-700">
                      Subscribe to Sting9 newsletter for updates on dataset milestones, new research findings, and AI model releases
                    </span>
                  </label>
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
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Quick Links */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Looking for something specific?
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <a href="/about" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  About the Project
                </a>
                <a href="/dataset" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Dataset Access
                </a>
                <a href="/research" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  API Documentation
                </a>
                <a href="/partners" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Partnership Information
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
