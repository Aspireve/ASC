// import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* <Link href="/" className="text-xl font-bold"> */}
            Agreed
          {/* </Link> */}
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero')} className="font-medium text-black">
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className="font-medium text-gray-600 hover:text-black">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="font-medium text-gray-600 hover:text-black">
              Pricing
            </button>
            <button onClick={() => scrollToSection('about')} className="font-medium text-gray-600 hover:text-black">
              About
            </button>
          </div>

          {/* <Link href="/contact"> */}
            <Button variant="default" className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-6">
              Contact us
            </Button>
          {/* </Link> */}
        </div>
      </div>
    </nav>
  )
}

