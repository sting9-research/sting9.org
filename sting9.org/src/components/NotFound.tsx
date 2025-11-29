import { Link } from '@tanstack/react-router'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <span className="text-8xl font-bold text-amber-500">404</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Don't worry, even the best phishing detectors sometimes lose their way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Looking for something specific? Try our{' '}
            <Link to="/submit/email" className="text-amber-600 hover:text-amber-700 font-medium">
              email submission
            </Link>
            {' '}or{' '}
            <Link to="/dataset" className="text-amber-600 hover:text-amber-700 font-medium">
              dataset
            </Link>
            {' '}pages.
          </p>
        </div>
      </div>
    </main>
  )
}
