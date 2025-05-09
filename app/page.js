import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Manufacturing Assessment Tool
          </h1>
          <p className="text-xl text-gray-600">
            Discover your path to Industry 4.0 excellence
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">🏭</span>
                <h3 className="text-lg font-medium text-gray-800">Smart Factory</h3>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">📊</span>
                <h3 className="text-lg font-medium text-gray-800">Data Analytics</h3>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">🤖</span>
                <h3 className="text-lg font-medium text-gray-800">Automation</h3>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">🔄</span>
                <h3 className="text-lg font-medium text-gray-800">Digital Twin</h3>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">🔌</span>
                <h3 className="text-lg font-medium text-gray-800">IoT</h3>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">🌱</span>
                <h3 className="text-lg font-medium text-gray-800">Sustainability</h3>
              </div>
            </div>
          </div>
          
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How it works:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Complete a short assessment of your current manufacturing capabilities.</li>
              <li>Rank your business priorities to tailor recommendations.</li>
              <li>Add optional financial data for ROI calculations.</li>
              <li>Receive a personalized 3-year technology roadmap.</li>
            </ol>
          </div>
          
          <Link 
            href="/assessment"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
          >
            Start Your Assessment
            <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>
            All data is kept confidential and used only for generating your assessment results.
          </p>
        </div>
      </div>
    </div>
  );
}
