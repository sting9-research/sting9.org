import { createFileRoute } from '@tanstack/react-router'
import { Shield, Lock, AlertTriangle, Eye, Server, Bug, CheckCircle, XCircle, Mail, ExternalLink } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/security')({ component: SecurityPage })

function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-blue-50 to-white border-b border-blue-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-hero font-bold text-slate-900 mb-6">
              Security
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              Protecting users from phishing and protecting our platform from abuse
            </p>
            <p className="text-lg text-slate-600">
              Security is at the core of everything we do. Learn how to protect yourself from phishing
              and how we secure the Sting9 platform.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-red-50 rounded-xl p-6 text-center border-2 border-red-200">
                <div className="text-4xl font-bold text-red-600 mb-2">5.3B</div>
                <p className="text-red-800 font-semibold">Phishing emails daily</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 text-center border-2 border-orange-200">
                <div className="text-4xl font-bold text-orange-600 mb-2">$10.3B</div>
                <p className="text-orange-800 font-semibold">Lost to scams annually</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-6 text-center border-2 border-amber-200">
                <div className="text-4xl font-bold text-amber-600 mb-2">1 in 3</div>
                <p className="text-amber-800 font-semibold">People fall for phishing</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6 text-center border-2 border-yellow-200">
                <div className="text-4xl font-bold text-yellow-600 mb-2">87%</div>
                <p className="text-yellow-800 font-semibold">Smishing bypass filters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Security Section */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold text-slate-900 mb-4">
                Protecting Yourself from Phishing
              </h2>
              <p className="text-xl text-slate-600">
                Learn how to identify and avoid phishing, smishing, and scam attempts
              </p>
            </div>

            {/* How to Spot Phishing */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">How to Spot Phishing</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Red Flags in Emails</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Urgent or threatening language:</span>
                        <span className="text-slate-700"> "Your account will be closed!", "Immediate action required!"</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Suspicious sender addresses:</span>
                        <span className="text-slate-700"> paypal-secure@service-verify.com instead of @paypal.com</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Generic greetings:</span>
                        <span className="text-slate-700"> "Dear Customer" instead of your actual name</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Suspicious links:</span>
                        <span className="text-slate-700"> Hover over links to see where they really go (don't click!)</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Unexpected attachments:</span>
                        <span className="text-slate-700"> Especially .exe, .zip, or .doc files you weren't expecting</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Poor grammar and spelling:</span>
                        <span className="text-slate-700"> Professional companies proofread their emails</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Requests for sensitive information:</span>
                        <span className="text-slate-700"> Legitimate companies never ask for passwords via email</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Red Flags in Text Messages (Smishing)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Unknown senders:</span>
                        <span className="text-slate-700"> Messages from numbers you don't recognize claiming to be your bank</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Shortened URLs:</span>
                        <span className="text-slate-700"> bit.ly, tinyurl.com links that hide the real destination</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Prize or lottery notifications:</span>
                        <span className="text-slate-700"> "Congratulations! You've won!" (you didn't enter anything)</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Delivery notifications:</span>
                        <span className="text-slate-700"> Fake UPS/FedEx/Amazon messages when you haven't ordered anything</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Account verification requests:</span>
                        <span className="text-slate-700"> "Click here to verify your account" from services you don't use</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What to Do */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-slate-900">What to Do If You Receive a Suspicious Message</h3>
              </div>

              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-green-700">1</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Don't click any links or download attachments</span>
                    <p className="text-slate-700 mt-1">Even hovering can sometimes trigger malicious scripts in some contexts</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-green-700">2</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Verify independently</span>
                    <p className="text-slate-700 mt-1">Contact the company directly using their official website or phone number (not the one in the message)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-green-700">3</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Report it to Sting9</span>
                    <p className="text-slate-700 mt-1">
                      Submit the message to us at <a href="/submit" className="text-blue-600 hover:text-blue-700 font-semibold">sting9.org/submit</a> or forward to{' '}
                      <a href="mailto:submit@sting9.org" className="text-blue-600 hover:text-blue-700 font-semibold">submit@sting9.org</a>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-green-700">4</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Delete the message</span>
                    <p className="text-slate-700 mt-1">Remove it from your inbox or phone to avoid accidentally clicking later</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-green-700">5</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Warn others</span>
                    <p className="text-slate-700 mt-1">If it's a widespread scam, alert friends, family, and colleagues</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-blue-200" />
                <h3 className="text-2xl font-bold">Security Best Practices</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-100">Email Security</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Enable two-factor authentication (2FA)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Use strong, unique passwords</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Keep software and antivirus updated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Use a password manager</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-100">Mobile Security</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Don't reply to unknown text messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Verify sender before clicking SMS links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Enable spam filtering on your phone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Keep your OS and apps updated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Security Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold text-slate-900 mb-4">
                How We Secure Sting9
              </h2>
              <p className="text-xl text-slate-600">
                Our commitment to protecting your privacy and securing the platform
              </p>
            </div>

            {/* Infrastructure Security */}
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900">Infrastructure Security</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Swiss Hosting:</span>
                    <span className="text-slate-700"> All data hosted on Upsun infrastructure in Switzerland, benefiting from strong data protection laws</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Encryption in Transit:</span>
                    <span className="text-slate-700"> TLS 1.3 encryption for all connections (HTTPS only, no HTTP)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Encryption at Rest:</span>
                    <span className="text-slate-700"> PostgreSQL database with full-disk encryption and encrypted backups</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Network Security:</span>
                    <span className="text-slate-700"> Firewall protection, DDoS mitigation, and intrusion detection systems</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Regular Backups:</span>
                    <span className="text-slate-700"> Automated encrypted backups with 30-day retention and point-in-time recovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Security */}
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">Application Security</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Automatic PII Redaction:</span>
                    <span className="text-slate-700"> All submitted messages pass through anonymization pipeline before storage (emails, phone numbers, names, addresses, SSNs, credit cards, IPs)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">SQL Injection Prevention:</span>
                    <span className="text-slate-700"> Parameterized queries with sqlc (type-safe, prepared statements only)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Input Validation:</span>
                    <span className="text-slate-700"> Strict validation on all user inputs with Go's validator library</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Rate Limiting:</span>
                    <span className="text-slate-700"> Prevents abuse of submission endpoints and API flooding</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">CORS Protection:</span>
                    <span className="text-slate-700"> Strict origin checking to prevent unauthorized cross-origin requests</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Content Security Policy:</span>
                    <span className="text-slate-700"> Prevents XSS attacks and unauthorized script execution</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Secure File Uploads:</span>
                    <span className="text-slate-700"> File type validation, size limits, and malware scanning</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-slate-900">Access Control & Authentication</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">JWT Authentication:</span>
                    <span className="text-slate-700"> Secure token-based authentication for researcher and partner API access</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Password Security:</span>
                    <span className="text-slate-700"> Bcrypt hashing with high cost factor for all stored passwords</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Row-Level Security:</span>
                    <span className="text-slate-700"> PostgreSQL RLS policies ensure users can only access authorized data</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Audit Logging:</span>
                    <span className="text-slate-700"> All data access and modifications logged with timestamps and user IDs</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Principle of Least Privilege:</span>
                    <span className="text-slate-700"> Database users and API roles have minimal permissions required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring */}
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-slate-900">Monitoring & Incident Response</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">24/7 Monitoring:</span>
                    <span className="text-slate-700"> Automated monitoring of infrastructure, application, and security events</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Security Scanning:</span>
                    <span className="text-slate-700"> Regular vulnerability scans with automated and manual penetration testing</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Dependency Updates:</span>
                    <span className="text-slate-700"> Automated security patches and dependency vulnerability tracking (Dependabot/Snyk)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Incident Response Plan:</span>
                    <span className="text-slate-700"> Documented procedures for security incidents with defined escalation paths</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Breach Notification:</span>
                    <span className="text-slate-700"> Commitment to notify affected parties within 72 hours of confirmed breach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Bug className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-slate-900">Responsible Disclosure Policy</h3>
              </div>

              <p className="text-slate-700 mb-6">
                We take security vulnerabilities seriously and appreciate the security research community's efforts
                to help keep Sting9 and our users safe. If you discover a security vulnerability, please follow
                our responsible disclosure process.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p className="text-amber-900 font-semibold mb-2">
                  ⚠ Responsible Disclosure Guidelines
                </p>
                <p className="text-amber-800">
                  Please report vulnerabilities privately to our security team. Do NOT publicly disclose until we've
                  had time to address the issue. We commit to responding within 48 hours.
                </p>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-3">How to Report a Security Vulnerability</h4>
              <ol className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-red-700">1</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Email our security team:</span>
                    <p className="text-slate-700 mt-1">
                      <a href="mailto:security@sting9.org" className="text-blue-600 hover:text-blue-700 font-semibold">security@sting9.org</a>
                      {' '}(PGP key available upon request)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-red-700">2</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Include detailed information:</span>
                    <ul className="list-disc pl-6 text-slate-700 mt-2 space-y-1">
                      <li>Description of the vulnerability</li>
                      <li>Steps to reproduce the issue</li>
                      <li>Potential impact and severity</li>
                      <li>Any proof-of-concept code or screenshots</li>
                      <li>Your contact information for follow-up</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-red-700">3</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Wait for our response:</span>
                    <p className="text-slate-700 mt-1">We will acknowledge receipt within 48 hours and provide a timeline for resolution</p>
                  </div>
                </li>
              </ol>

              <h4 className="text-xl font-bold text-slate-900 mb-3">What We Promise</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Acknowledge your report within 48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Keep you informed of our progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Credit you in our security acknowledgments (if desired)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Work with you to understand and address the issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Not pursue legal action against good-faith security researchers</span>
                </li>
              </ul>

              <h4 className="text-xl font-bold text-slate-900 mb-3">Scope</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h5 className="font-bold text-green-900 mb-2">In Scope:</h5>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• sting9.org website</li>
                    <li>• api.sting9.org API</li>
                    <li>• submit@sting9.org email endpoint</li>
                    <li>• Authentication systems</li>
                    <li>• Data processing pipelines</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h5 className="font-bold text-red-900 mb-2">Out of Scope:</h5>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Social engineering attacks</li>
                    <li>• Physical security</li>
                    <li>• DoS/DDoS attacks</li>
                    <li>• Third-party services</li>
                    <li>• Spam or content issues</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 font-semibold mb-2">Hall of Fame</p>
                <p className="text-blue-800">
                  Security researchers who responsibly disclose vulnerabilities will be acknowledged on our
                  Security Hall of Fame page (coming soon). Thank you for helping keep Sting9 secure!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">Security Contact</h3>
              </div>
              <p className="text-slate-300 mb-4">
                For security concerns, vulnerability reports, or questions about our security practices:
              </p>
              <div className="space-y-2">
                <p className="text-white"><strong>Security Team:</strong> <a href="mailto:security@sting9.org" className="text-emerald-400 hover:text-emerald-300">security@sting9.org</a></p>
                <p className="text-white"><strong>General Inquiries:</strong> <a href="mailto:hello@sting9.org" className="text-emerald-400 hover:text-emerald-300">hello@sting9.org</a></p>
                <p className="text-slate-300 mt-4 text-sm">
                  PGP public key available upon request for encrypted communications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
