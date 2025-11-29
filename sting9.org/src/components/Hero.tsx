import { Shield, Mail, Smartphone } from 'lucide-react'
import * as m from '../paraglide/messages'
import { localizeUrl } from '../paraglide/runtime'

export default function Hero() {
  return (
    <section className="relative bg-linear-to-b from-slate-50 to-white section-spacing overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                <img
                  src="/sting9-logo.webp"
                  alt="Sting9 Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-hero font-bold text-slate-900 mb-6">
            {m.home_hero_title_part1()}
            <span className="block text-amber-600 mt-2">{m.home_hero_title_part2()}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {m.home_hero_subtitle()}{' '}
            <span className="font-semibold text-slate-900">{m.home_hero_subtitle_accuracy()}</span>.
          </p>

          {/* Key stats bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span><strong className="text-slate-900">5.3B</strong> {m.home_hero_stat1()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span><strong className="text-slate-900">$10.3B</strong> {m.home_hero_stat2()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span><strong className="text-slate-900">1 in 3</strong> {m.home_hero_stat3()}</span>
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href={typeof localizeUrl('/submit/email') === 'string' ? localizeUrl('/submit/email') : localizeUrl('/submit/email').href}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span>{m.home_hero_submit_email()}</span>
              <div className="absolute inset-0 rounded-lg bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-full group-hover:translate-x-[-200%]"></div>
            </a>

            <a
              href={typeof localizeUrl('/submit/sms') === 'string' ? localizeUrl('/submit/sms') : localizeUrl('/submit/sms').href}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-slate-800/30 hover:shadow-xl hover:shadow-slate-800/40 hover:scale-105"
            >
              <Smartphone className="w-5 h-5" />
              <span>{m.home_hero_submit_sms()}</span>
              <div className="absolute inset-0 rounded-lg bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-full group-hover:translate-x-[-200%]"></div>
            </a>
          </div>

          {/* Email forwarding alert */}
          <div className="max-w-2xl mx-auto mb-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  {m.home_hero_email_forward_title()}
                </p>
                <p className="text-sm text-blue-800">
                  {m.home_hero_email_forward_text()}{' '}
                  <a
                    href="mailto:submit@sting9.org"
                    className="font-semibold underline hover:text-blue-600 transition-colors"
                  >
                    submit@sting9.org
                  </a>
                  {' '}{m.home_hero_email_forward_and()}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-sm text-slate-500">
            <Shield className="w-4 h-4 inline-block mr-1" />
            {m.home_hero_privacy_notice()}
          </p>
        </div>
      </div>
    </section>
  )
}
