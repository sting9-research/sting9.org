import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Zap, Lightbulb, TrendingUp, Clock, Target, Users, Mail, CheckCircle2 } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/partners')({
  component: PartnersPage,
})

type PartnerType = 'academic' | 'enterprise' | 'government' | 'nonprofit' | 'security_vendor' | 'other'
type ContributionType = 'data' | 'funding' | 'research' | 'technology' | 'distribution' | 'other'

function PartnersPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '' as PartnerType | '',
    website: '',
    country: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    contributionTypes: [] as ContributionType[],
    contributionDescription: '',
    expectedVolume: '',
    existingDataset: '',
    technicalCapabilities: '',
    apiIntegration: false,
    bulkSubmission: false,
    timeline: '',
    budget: '',
    additionalInfo: '',
    agreeToTerms: false,
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

  const handleContributionTypeChange = (type: ContributionType) => {
    setFormData(prev => ({
      ...prev,
      contributionTypes: prev.contributionTypes.includes(type)
        ? prev.contributionTypes.filter(t => t !== type)
        : [...prev.contributionTypes, type]
    }))
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
            Partnership Request Submitted!
          </h2>
          <p className="text-slate-600 mb-6">
            Thank you for your interest in partnering with Sting9. Our team will review your application and get back to you within 3-5 business days.
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
              Become a Partner
            </h1>
            <p className="text-body-lg text-slate-600 leading-relaxed">
              Join leading organizations worldwide in building the most comprehensive open-source dataset to fight phishing, smishing, and digital scams.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-slate-900 mb-4">
              Partnership Benefits
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Partners receive enhanced access, recognition, and early insights from the world's largest scam dataset.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Priority API Access
              </h3>
              <p className="text-slate-600">
                Higher rate limits, bulk submission endpoints, and early access to new features.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Research Collaboration
              </h3>
              <p className="text-slate-600">
                Co-author papers, access pre-publication models, and contribute to cutting-edge AI research.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Brand Recognition
              </h3>
              <p className="text-slate-600">
                Logo placement on our website, mentions in research papers, and public acknowledgment.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Early Access
              </h3>
              <p className="text-slate-600">
                Get trained models, threat intelligence feeds, and dataset updates before public release.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Dedicated Support
              </h3>
              <p className="text-slate-600">
                Direct communication channel with our team for technical assistance and custom integrations.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Network Access
              </h3>
              <p className="text-slate-600">
                Connect with other partners, researchers, and industry leaders in cybersecurity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-slate-900 mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-slate-600">
              Join these leading organizations in the fight against digital deception
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-20 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                Partner Logo
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Partnership Application
              </h2>
              <p className="text-slate-600">
                Fill out the form below and our team will contact you within 3-5 business days to discuss the partnership.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Organization Information */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Organization Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizationType" className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      required
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select type...</option>
                      <option value="academic">Academic Institution</option>
                      <option value="enterprise">Enterprise / Corporation</option>
                      <option value="government">Government Agency</option>
                      <option value="nonprofit">Non-Profit Organization</option>
                      <option value="security_vendor">Security Vendor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
                      Website <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      required
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Primary Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactTitle" className="block text-sm font-medium text-slate-700 mb-2">
                      Job Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactTitle"
                      name="contactTitle"
                      required
                      value={formData.contactTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      required
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Partnership Details */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Partnership Details
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    How would you like to contribute? <span className="text-red-600">*</span>
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { value: 'data', label: 'Data Contributions (phishing/scam samples)' },
                      { value: 'funding', label: 'Financial Support' },
                      { value: 'research', label: 'Research & Development' },
                      { value: 'technology', label: 'Technology & Infrastructure' },
                      { value: 'distribution', label: 'Distribution & Promotion' },
                      { value: 'other', label: 'Other' },
                    ].map(option => (
                      <label key={option.value} className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.contributionTypes.includes(option.value as ContributionType)}
                          onChange={() => handleContributionTypeChange(option.value as ContributionType)}
                          className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                        />
                        <span className="ml-2 text-sm text-slate-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="contributionDescription" className="block text-sm font-medium text-slate-700 mb-2">
                    Describe Your Proposed Contribution <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="contributionDescription"
                    name="contributionDescription"
                    required
                    rows={4}
                    value={formData.contributionDescription}
                    onChange={handleInputChange}
                    placeholder="Please provide details about what you can contribute and how you envision the partnership..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="expectedVolume" className="block text-sm font-medium text-slate-700 mb-2">
                      Expected Data Volume (if applicable)
                    </label>
                    <input
                      type="text"
                      id="expectedVolume"
                      name="expectedVolume"
                      placeholder="e.g., 10,000 messages per month"
                      value={formData.expectedVolume}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="existingDataset" className="block text-sm font-medium text-slate-700 mb-2">
                      Existing Dataset Size (if any)
                    </label>
                    <input
                      type="text"
                      id="existingDataset"
                      name="existingDataset"
                      placeholder="e.g., 500,000 samples"
                      value={formData.existingDataset}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Technical Information
                </h3>

                <div className="mb-6">
                  <label htmlFor="technicalCapabilities" className="block text-sm font-medium text-slate-700 mb-2">
                    Technical Capabilities & Infrastructure
                  </label>
                  <textarea
                    id="technicalCapabilities"
                    name="technicalCapabilities"
                    rows={3}
                    value={formData.technicalCapabilities}
                    onChange={handleInputChange}
                    placeholder="Describe your technical setup, APIs, data processing capabilities, etc..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="apiIntegration"
                      checked={formData.apiIntegration}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-700">
                      We need API integration for automated data submission
                    </span>
                  </label>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="bulkSubmission"
                      checked={formData.bulkSubmission}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-700">
                      We require bulk submission capabilities
                    </span>
                  </label>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Timeline & Budget
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-2">
                      Proposed Timeline
                    </label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      placeholder="e.g., Start in Q3 2025, 12-month commitment"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                      Budget Range (if applicable)
                    </label>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      placeholder="e.g., $50,000 - $100,000"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Additional Information
                </h3>
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-700 mb-2">
                    Any other information you'd like to share?
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Additional details, special requirements, questions, etc..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                  />
                  <span className="ml-3 text-sm text-slate-700">
                    I agree to Sting9's partnership terms and conditions, including data privacy policies,
                    open-source licensing (CC0), and ethical use guidelines. I confirm that I have the
                    authority to submit this partnership application on behalf of my organization. <span className="text-red-600">*</span>
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
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-spacing bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Questions About Partnership?
          </h2>
          <p className="text-slate-600 mb-6">
            Our partnerships team is here to help answer any questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:partners@sting9.org"
              className="flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              <Mail className="w-5 h-5 mr-2" />
              partners@sting9.org
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
