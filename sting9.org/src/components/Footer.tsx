import { Shield, Mail, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react'
import * as m from '../paraglide/messages'
import { localizeUrl } from '../paraglide/runtime'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

export default function Footer() {
  const sections: FooterSection[] = [
    {
      title: m.footer_section_get_started(),
      links: [
        { label: m.footer_link_submit_email(), href: '/submit/email' },
        { label: m.footer_link_submit_sms(), href: '/submit/sms' },
        { label: m.footer_link_how_it_works(), href: '/#how-it-works' },
        { label: m.footer_link_learn_threats(), href: '/learn' },
      ],
    },
    {
      title: m.footer_section_research(),
      links: [
        { label: m.footer_link_dataset(), href: '/dataset' },
        { label: m.footer_link_api_docs(), href: '/research/api-docs' },
        { label: m.footer_link_statistics(), href: '/stats' },
      ],
    },
    {
      title: m.footer_section_about(),
      links: [
        { label: m.footer_link_mission(), href: '/about' },
        { label: m.footer_link_partners(), href: '/partners' },
      ],
    },
    {
      title: m.footer_section_legal(),
      links: [
        { label: m.footer_link_privacy(), href: '/privacy' },
        { label: m.footer_link_terms(), href: '/terms' },
        { label: m.footer_link_license(), href: '/license' },
        { label: m.footer_link_contact(), href: '/contact' },
      ],
    },
  ]

  const contactEmails = [
    { label: m.footer_contact_research(), email: 'research@sting9.org' },
    { label: m.footer_contact_partners(), email: 'partners@sting9.org' },
    { label: m.footer_contact_press(), email: 'press@sting9.org' },
    { label: m.footer_contact_general(), email: 'info@sting9.org' },
  ]

  // Helper function to properly handle localizeUrl return type
  const getLocalizedHref = (href: string): string => {
    const result = localizeUrl(href)
    return typeof result === 'string' ? result : result.href
  }

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container-custom py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/sting9-logo.webp"
                alt="Sting9 Logo"
                className="w-12 h-12 object-contain bg-white rounded-lg p-1"
              />
              <div className="text-2xl font-bold text-white">Sting9</div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {m.footer_tagline()}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/sting9-research"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/sting9research"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/company/sting9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={getLocalizedHref(link.href)}
                      className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div className="border-t border-slate-800 pt-12 mb-12">
          <h3 className="font-bold text-white mb-6 text-center">{m.footer_contact_title()}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {contactEmails.map((contact, index) => (
              <a
                key={index}
                href={`mailto:${contact.email}`}
                className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">
                      {contact.label}
                    </div>
                    <div className="text-xs text-slate-400 group-hover:text-amber-400 transition-colors">
                      {contact.email}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} {m.footer_copyright()}{' '}
              <a href={getLocalizedHref('/license')} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {m.footer_link_license()}
              </a>
            </div>
            <div className="flex items-center gap-6">
              <a href={getLocalizedHref('/privacy')} className="hover:text-slate-300 transition-colors">
                {m.footer_link_privacy()}
              </a>
              <a href={getLocalizedHref('/terms')} className="hover:text-slate-300 transition-colors">
                {m.footer_link_terms()}
              </a>
              <a href={getLocalizedHref('/security')} className="hover:text-slate-300 transition-colors">
                {m.footer_link_security()}
              </a>
            </div>
          </div>
        </div>

        {/* Upsun hosting banner */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="text-center">
            <a
              href="https://upsun.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors group"
            >
              <span>{m.footer_hosted_with()}</span>
              <span className="text-purple-400 group-hover:scale-110 transition-transform inline-block">💜</span>
              <span>{m.footer_hosted_by()} <span className="font-semibold text-slate-300">Upsun</span></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
