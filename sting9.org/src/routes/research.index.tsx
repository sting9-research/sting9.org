import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/research/')({
  component: ResearchPage,
})

function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Research Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Access the Sting9 dataset, API documentation, and research resources
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* API Documentation Card */}
          <Link
            to="/research/api-docs"
            className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                API Documentation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Interactive API reference with endpoints, authentication, and code examples
              </p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                View API Docs
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Dataset Access Card */}
          <div className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Dataset Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Download the Sting9 dataset for training your own models (authentication required)
              </p>
              <span className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Authentication Guide Card */}
          <div className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Authentication Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Learn how to register as a researcher and authenticate API requests with JWT tokens
              </p>
              <span className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Code Examples Card */}
          <div className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-8">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Code Examples
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sample code in Python, JavaScript, Go, and more to integrate with the Sting9 API
              </p>
              <span className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
          <p className="text-purple-100 mb-6">
            Get started with the Sting9 API in minutes:
          </p>
          <div className="bg-black bg-opacity-20 rounded-lg p-6 font-mono text-sm overflow-x-auto">
            <div className="text-purple-200"># Register as a researcher</div>
            <div className="text-white mt-2">
              curl -X POST https://api.sting9.org/api/v1/auth/register \
            </div>
            <div className="text-white ml-4">-H "Content-Type: application/json" \</div>
            <div className="text-white ml-4">
              -d '&#123;"email":"researcher@university.edu","password":"SecurePass123!"&#125;'
            </div>
            <div className="text-purple-200 mt-4"># Submit a suspicious message</div>
            <div className="text-white mt-2">
              curl -X POST https://api.sting9.org/api/v1/submissions \
            </div>
            <div className="text-white ml-4">-H "Content-Type: application/json" \</div>
            <div className="text-white ml-4">
              -d '&#123;"type":"email","content":"Suspicious message..."&#125;'
            </div>
          </div>
          <div className="mt-6">
            <Link
              to="/research/api-docs"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors duration-300"
            >
              Explore Full Documentation
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Contact our research team for support, partnerships, or questions
          </p>
          <a
            href="mailto:research@sting9.org"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Contact Research Team
          </a>
        </div>
      </div>
    </div>
  )
}
