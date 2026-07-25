import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-md w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center transition-colors duration-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong.</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                An unexpected error has occurred in the application. Don't worry, your data is safe.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Reload Page
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs text-red-500 font-mono">
                  <p className="font-bold mb-1">{this.state.error.toString()}</p>
                  <p>{this.state.errorInfo.componentStack}</p>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
