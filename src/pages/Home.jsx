import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Card from '../components/Card'
import Footer from '../components/Footer'

export default function Home() {
  const features = [
    {
      title: 'Disease Detection',
      description: 'Upload an image of your crop and get instant AI-powered disease detection with confidence scores and treatment recommendations.',
      actionText: 'Detect Disease'
    },
    {
      title: 'Farmer Advisory',
      description: 'Chat with our AI-powered advisor for personalized agricultural guidance, crop care tips, and disease prevention strategies.',
      actionText: 'Get Advice'
    },
    {
      title: 'Diagnosis History',
      description: 'Keep track of all your crop disease diagnoses, treatments applied, and monitor your farm health over time.',
      actionText: 'View History'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Features</h2>
            <p className="text-xl text-gray-600">Everything you need to protect your crops and maximize yield</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                title={feature.title}
                description={feature.description}
                actionText={feature.actionText}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
