interface FeatureCardProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

export function FeatureCard({ title, description, children, className = "" }: FeatureCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all ${className}`}>
      <div className="space-y-4">
        <div className="mb-6">
          {children}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

