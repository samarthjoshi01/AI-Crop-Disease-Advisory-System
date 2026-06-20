export default function Card({ title, description, image, actionText }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Image Placeholder */}
      <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Image Placeholder</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{description}</p>
        <button className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition">
          {actionText || 'Learn More'}
        </button>
      </div>
    </div>
  )
}
