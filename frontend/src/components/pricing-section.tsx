import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface PricingFeature {
  text: string
}

interface PricingTier {
  name: string
  price: string
  description: string
  features: PricingFeature[]
  isBestSeller?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "Essential Plan",
    price: "1,299/-",
    description: "(For Individuals and Small Teams)",
    features: [
      { text: "Real-Time Time-Zone Tracking" },
      { text: "Streamlined Request Management" },
      { text: "Collaborative Editor" },
      { text: "Basic Encryption Security" },
      { text: "Up to 5 Users" },
    ],
  },
  {
    name: "Professional Plan",
    price: "4,299/-",
    description: "(For SMEs and Growing Teams)",
    features: [
      { text: "Everything in Essential, plus:" },
      { text: "Timely Filters for Prioritization" },
      { text: "Advanced Encryption & Security" },
      { text: "Multi-Language Support" },
      { text: "Up to 25 Users" },
      { text: "Dedicated Email Support" },
    ],
    isBestSeller: true,
  },
  {
    name: "Enterprise Plan",
    price: "Custom Pricing (Based on Needs)",
    description: "(For Large Organizations)",
    features: [
      { text: "Everything in Professional, plus:" },
      { text: "Custom Integration with Existing Tools" },
      { text: "Advanced Analytics & Insights" },
      { text: "Unlimited Users" },
      { text: "Priority Onboarding & 24/7 Support" },
      { text: "Customizable Agreement Templates" },
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-white rounded-full px-6 py-2 shadow-sm mb-4">
            <h2 className="text-xl font-medium">Pricing</h2>
          </div>
          <h3 className="text-3xl md:text-4xl font-medium text-gray-700 max-w-3xl mx-auto">
            Simple Plans, Powerful Features — Find the Perfect Fit for Your Needs.
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {pricingTiers.map((tier, index) => (
            <div key={tier.name} className="relative">
              {tier.isBestSeller && (
                <div className="absolute inset-x-0 -top-4 mx-auto w-full">
                  <div className="bg-purple-500 text-white text-center py-2 rounded-t-xl">
                    ✨ Best Seller
                  </div>
                </div>
              )}
              <Card className={`${tier.isBestSeller ? 'border-purple-500 shadow-lg' : ''} h-full`}>
                <CardHeader className="p-6">
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                  <div className="mt-4">
                    <span className={`text-3xl font-bold ${index === 1 ? 'text-purple-500' : index === 2 ? 'text-green-600' : 'text-orange-500'}`}>
                      {tier.price.split('(')[0]}
                    </span>
                    {tier.price.includes('(') && (
                      <span className="text-sm text-gray-600 ml-1">
                        ({tier.price.split('(')[1]}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-600">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

