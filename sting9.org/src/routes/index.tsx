import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/Hero'
import StatsCounter from '../components/StatsCounter'
import HowItWorks from '../components/HowItWorks'
import ImpactSection from '../components/ImpactSection'
import ThreatExamples from '../components/ThreatExamples'
import Footer from '../components/Footer'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <StatsCounter />
      <HowItWorks />
      <ImpactSection />
      <ThreatExamples />
      <Footer />
    </div>
  )
}
