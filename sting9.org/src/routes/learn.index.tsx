import { createFileRoute, Link } from '@tanstack/react-router'
import { GraduationCap, User, Briefcase, Clock, Target, Shield } from 'lucide-react'

export const Route = createFileRoute('/learn/')({ component: LearnPage })

function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Free Educational Courses</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Learn to Protect Yourself from Digital Threats
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the course that's right for you. Both courses are comprehensive,
            free, and designed to give you practical skills to recognize and defend
            against phishing, smishing, and scam attempts.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Individuals Course */}
          <Link
            to="/learn/individuals"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500"
          >
            <div className="p-8">
              <div className="text-6xl mb-6">👤</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Individuals Course
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Protect yourself and your family from daily digital threats
              </p>

              {/* Course Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>~2 hours • 12 chapters</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span>Beginner-friendly</span>
                </div>
              </div>

              {/* Key Topics */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">What you'll learn:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Email and SMS phishing scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Social media and romance scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Banking, shopping, and delivery fraud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Cryptocurrency and investment scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>What to do if you're targeted</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <div className="bg-blue-600 group-hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition-colors">
                  Start Learning →
                </div>
              </div>
            </div>
          </Link>

          {/* Professionals Course */}
          <Link
            to="/learn/professionals"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-500"
          >
            <div className="p-8">
              <div className="text-6xl mb-6">💼</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                Professionals Course
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Defend your organization from sophisticated business attacks
              </p>

              {/* Course Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span>~2 hours • 12 chapters</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>Intermediate level</span>
                </div>
              </div>

              {/* Key Topics */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">What you'll learn:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Business Email Compromise (BEC)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>CEO fraud and whaling attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Wire transfer and invoice fraud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Supply chain and deepfake threats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Building security-conscious organizations</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <div className="bg-purple-600 group-hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition-colors">
                  Start Learning →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Why Take These Courses */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Take These Courses?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">$12.5B Lost in 2024</h3>
              <p className="text-gray-600 text-sm">
                Consumers lost $12.5 billion to fraud in 2024 alone
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1 in 3 Fall Victim</h3>
              <p className="text-gray-600 text-sm">
                One in three people have fallen for phishing attempts
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">86% Improvement</h3>
              <p className="text-gray-600 text-sm">
                Training reduces phishing success rates by up to 86%
              </p>
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Which Course Is Right for You?
          </h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-blue-600 mb-3">Choose Individuals if you:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Want to protect your personal finances</li>
                  <li>• Use email, text, and social media daily</li>
                  <li>• Shop online or use banking apps</li>
                  <li>• Want to help family members stay safe</li>
                  <li>• Prefer jargon-free explanations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-purple-600 mb-3">Choose Professionals if you:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Work in business, IT, or finance</li>
                  <li>• Handle company finances or wire transfers</li>
                  <li>• Manage employees or security policies</li>
                  <li>• Need to protect organizational assets</li>
                  <li>• Want advanced threat intelligence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
