export function AboutSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-white rounded-full px-6 py-2 shadow-sm mb-4">
            <h2 className="text-xl font-medium">About Us</h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-800">
            Simple to <span className="inline-block">Agree</span> easy to <span className="inline-block">Send.</span>
          </h3>

          <div className="inline-block">
            <button className="bg-[#1a1a1a] text-white rounded-full px-6 py-2">
              Who are we?
            </button>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            We are a team of 4, aiming to expand our knowledge, refine our problem-solving abilities, and contribute meaningfully to the realm of innovation and engineering. We are here to present{' '}
            <span className="bg-yellow-400/90 px-2">an optimized way of escaping the</span>
            {' '}
            <span className="bg-yellow-400/90 px-2">agreement trap</span>
            , ensuring a seamless and efficient experience for users.
          </p>
        </div>
      </div>
    </section>
  )
}

