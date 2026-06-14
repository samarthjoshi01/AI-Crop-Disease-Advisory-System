export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Project Info */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">CropCare AI</h3>
            <p className="text-gray-400">
              AI-Powered Crop Disease Detection and Farmer Advisory System
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Disease Detection</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Farmer Advisory</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <span className="text-2xl">f</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <span className="text-2xl">𝕏</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <span className="text-2xl">in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 CropCare AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
