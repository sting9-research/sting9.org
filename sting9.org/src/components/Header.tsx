import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import {
  BookOpen,
  Database,
  Home,
  Menu,
  PieChart,
  Upload,
  X,
} from 'lucide-react'
import { getLocale, locales, localizeUrl } from '../paraglide/runtime.js'

// Flag components for language selector
function FlagEN() {
  return (
    <svg className="w-5 h-5 rounded-sm" viewBox="0 0 640 480" aria-hidden="true">
      <title>English</title>
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
    </svg>
  )
}

function FlagDE() {
  return (
    <svg className="w-5 h-5 rounded-sm" viewBox="0 0 640 480" aria-hidden="true">
      <title>Deutsch</title>
      <path fill="#FFCE00" d="M0 320h640v160H0z"/>
      <path fill="#000" d="M0 0h640v160H0z"/>
      <path fill="#DD0000" d="M0 160h640v160H0z"/>
    </svg>
  )
}

function FlagFR() {
  return (
    <svg className="w-5 h-5 rounded-sm" viewBox="0 0 640 480" aria-hidden="true">
      <title>Français</title>
      <path fill="#002654" d="M0 0h213.3v480H0z"/>
      <path fill="#FFF" d="M213.3 0h213.4v480H213.3z"/>
      <path fill="#CE1126" d="M426.7 0H640v480H426.7z"/>
    </svg>
  )
}

const languageConfig = {
  en: { flag: FlagEN, label: 'English', shortLabel: 'EN' },
  de: { flag: FlagDE, label: 'Deutsch', shortLabel: 'DE' },
  fr: { flag: FlagFR, label: 'Français', shortLabel: 'FR' },
} as const

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const location = useLocation()
  const currentLocale = getLocale()

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/stats', label: 'Statistics', icon: <PieChart size={20} /> },
    { to: '/dataset', label: 'Dataset', icon: <Database size={20} /> },
    { to: '/learn', label: 'Learn About Threats', icon: <BookOpen size={20} /> },
    { to: '/submit/email', label: 'Submit Email', icon: <Upload size={20} /> },
    { to: '/submit/sms', label: 'Submit SMS', icon: <Upload size={20} /> },
    { to: '/about', label: 'About', icon: <BookOpen size={20} /> },
  ]

  // Get the URL for switching to a different locale
  const getLocaleUrl = (targetLocale: string): string => {
    const currentPath = location.pathname
    const url = localizeUrl(currentPath, { locale: targetLocale })
    return typeof url === 'string' ? url : url.href
  }

  const CurrentFlag = languageConfig[currentLocale as keyof typeof languageConfig]?.flag || FlagEN

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
                <span className="hidden lg:inline">Sting9</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Language Selector and Mobile menu button */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  onBlur={() => setTimeout(() => setLangMenuOpen(false), 150)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  aria-label="Select language"
                  aria-expanded={langMenuOpen}
                  aria-haspopup="true"
                >
                  <CurrentFlag />
                  <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                    {languageConfig[currentLocale as keyof typeof languageConfig]?.shortLabel || 'EN'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    {locales.map((locale) => {
                      const config = languageConfig[locale as keyof typeof languageConfig]
                      if (!config) return null
                      const Flag = config.flag
                      const isActive = locale === currentLocale
                      return (
                        <a
                          key={locale}
                          href={getLocaleUrl(locale)}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-amber-50 text-amber-900'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Flag />
                          <span className="font-medium">{config.label}</span>
                          {isActive && (
                            <svg className="w-4 h-4 ml-auto text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-slate-700" />
              </button>
            </div>
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
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-slate-700" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
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
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </>
  )
}
