export function Footer() {
  return (
    <footer className="py-32 px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center space-y-24">
          {/* Agreement Document Illustration */}
          <div className="relative w-64 h-80 mx-auto">
            <div className="absolute inset-0 transform rotate-6">
              <div className="bg-white rounded-lg shadow-sm w-full h-full" />
            </div>
            <div className="absolute inset-0 transform -rotate-3">
              <div className="bg-white rounded-lg shadow-sm w-full h-full" />
            </div>
            <div className="absolute inset-0">
              <div className="bg-white rounded-lg shadow-sm w-full h-full p-6">
                <div className="space-y-4">
                  <div className="w-1/2 h-6 bg-gray-100 rounded" />
                  <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-full h-2 bg-gray-100 rounded" />
                    ))}
                  </div>
                  <div className="pt-8 flex justify-between">
                    <div className="w-20 h-2 bg-gray-100 rounded" />
                    <div className="w-20 h-2 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="text-7xl md:text-9xl font-medium text-gray-200">
            Agreed
          </div>

          {/* Copyright */}
          <div className="inline-block bg-white rounded-full px-6 py-2 shadow-sm">
            <p className="text-sm text-gray-600">
              2025 All rights reserved \highnotech
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

