import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Shield,
  Menu,
  X,
  Home,
  Upload,
  Database,
  Users,
  BookOpen,
  FileCode,
  PieChart,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/stats', label: 'Statistics', icon: <PieChart size={20} /> },
    { to: '/dataset', label: 'Dataset', icon: <Database size={20} /> },
    { to: '/learn', label: 'Learn About Threats', icon: <BookOpen size={20} /> },
    { to: '/submit/email', label: 'Submit Email', icon: <Upload size={20} /> },
    { to: '/submit/sms', label: 'Submit SMS', icon: <Upload size={20} /> },
    { to: '/about', label: 'About', icon: <BookOpen size={20} /> },
  ]

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/sting9-logo.webp"
                alt="Sting9 Logo"
                className="w-10 h-10 object-contain"
              />
              <div className="text-2xl font-bold text-slate-900">
                <span className="lg:hidden">Sting9</span>
                <span className="hidden lg:inline">Sting9 Research Initiative</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src="/sting9-logo.webp"
              alt="Sting9 Logo"
              className="w-10 h-10 object-contain"
            />
            <h2 className="text-xl font-bold text-slate-900">Sting9</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-slate-700" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors mb-2 text-slate-700 hover:text-slate-900"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-amber-100 text-amber-900 transition-colors mb-2',
              }}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-600 text-center">
            Making digital deception obsolete
          </p>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
