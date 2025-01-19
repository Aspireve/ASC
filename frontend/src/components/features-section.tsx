import { Clock, FileText, BrainCircuit, Users, Lock } from 'lucide-react'
import { FeatureCard } from './feature-card'

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-white rounded-full px-6 py-2 shadow-sm mb-4">
            <h2 className="text-xl font-medium">Features</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Time-Zone Tracking */}
          <FeatureCard
            title="Real-Time Time-Zone Tracking"
            description="Track and manage agreements seamlessly across different time zones. 'Agreed' ensures you're always aligned with global teams, providing real-time updates and notifications to avoid delays or miscommunications."
          >
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
              <Clock className="w-12 h-12 text-white" />
            </div>
          </FeatureCard>

          {/* Request Management */}
          <FeatureCard
            title="Streamlined Request Management"
            description="Organize and streamline agreement requests into a dedicated section. Prioritize tasks effectively with advanced filters and notifications, ensuring no request is overlooked."
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div className="bg-yellow-50 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <Lock className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </FeatureCard>

          {/* AI-Guided Decision Making */}
          <FeatureCard
            title="AI-Guided Smart Decision Making"
            description="Make smarter, risk-free decisions with AI-powered insights. 'Agreed' analyzes agreement data and provides actionable recommendations to enhance your efficiency and minimize errors."
          >
            <div className="flex justify-center">
              <div className="bg-purple-500 w-16 h-16 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
            </div>
          </FeatureCard>

          {/* Collaborative Editor */}
          <FeatureCard
            title="Collaborative Editor"
            description="Work together effortlessly with a Docs-style editor. Edit, comment, and finalize agreements in real time, ensuring everyone is on the same page, no matter where they are."
          >
            <div className="flex justify-center">
              <div className="bg-blue-50 w-full max-w-[200px] h-32 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </FeatureCard>

          {/* Advanced Encryption */}
          <FeatureCard
            title="Advanced Encryption and Security"
            description="Keep your agreements safe with top-tier encryption. 'Agreed' ensures your data remains private and secure, adhering to global security standards."
            className="md:col-span-2 max-w-2xl mx-auto"
          >
            <div className="flex justify-center">
              <div className="bg-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

