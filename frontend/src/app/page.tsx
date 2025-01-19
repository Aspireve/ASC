import { Navbar } from '@/components/navbar'
import { FloatingIcon } from '@/components/floating-icon'
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { AboutSection } from '@/components/about-section'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Copy, Shield, Users, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <main className="relative min-h-screen bg-transparent">
        <Navbar />
        
        {/* Hero Section */}
        <div id="hero" className="container mx-auto px-4">
          <div className="relative min-h-screen flex flex-col items-center justify-center">
            {/* Floating Icons */}
            <FloatingIcon color="purple-500" position="-top-4 -left-4 md:top-20 md:left-20">
              <Copy className="w-6 h-6" />
            </FloatingIcon>
            <FloatingIcon color="orange-500" position="-top-4 -right-4 md:top-20 md:right-20">
              <Shield className="w-6 h-6" />
            </FloatingIcon>
            <FloatingIcon color="green-500" position="-bottom-4 -left-4 md:bottom-20 md:left-20">
              <Copy className="w-6 h-6 rotate-90" />
            </FloatingIcon>
            <FloatingIcon color="blue-500" position="-bottom-4 -right-4 md:bottom-20 md:right-20">
              <Users className="w-6 h-6" />
            </FloatingIcon>
            <FloatingIcon color="yellow-500" position="bottom-20 md:bottom-0">
              <Globe className="w-6 h-6" />
            </FloatingIcon>

            {/* Main Content */}
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <p className="text-sm text-gray-600">{'{ Made at Imagine Hackathon }'}</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight">
                Simple to <span className="inline-block">Agree</span>
                <br />
                easy to <span className="inline-block">Send.</span>
              </h1>
              <div className="pt-8">
                <Link href="/contact">
                  <Button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* About Section */}
        <div id="about">
          <AboutSection />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}

