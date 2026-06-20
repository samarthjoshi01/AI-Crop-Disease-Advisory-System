import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function History() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Diagnosis History</h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              View your complete diagnosis history to track crop diseases, monitor trends, and see the effectiveness 
              of treatments applied. This helps you maintain better records and plan preventive strategies for future seasons.
            </p>

            {/* Placeholder History Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 transition-colors duration-200">
                    <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Date</th>
                    <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Crop</th>
                    <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Disease</th>
                    <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Confidence</th>
                    <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm transition-colors duration-200">Placeholder</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Placeholder</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm transition-colors duration-200">Placeholder</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-600 dark:border-yellow-400 p-4 rounded transition-colors duration-200">
              <p className="text-yellow-800 dark:text-yellow-100">
                <span className="font-bold">Note:</span> This is a placeholder for Week 2 deliverable. 
                MongoDB integration and history records coming in later weeks.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
