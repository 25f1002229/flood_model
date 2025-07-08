import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/home')
      .then(res => res.json())
      .then(data => {
        setAlerts(data.latest_alerts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching alerts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      {/* Hero Section */}      <section className="text-center py-12 px-4 sm:px-6 lg:px-8">        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Chennai Flood Watch
        </h1>
        <p className="text-2xl font-bold text-gray-800 mb-8 max-w-2xl mx-auto leading-tight">
          Real-time flood monitoring and prediction system to keep our community safe
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/map"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Live Map
          </Link>
          <Link
            to="/report"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
          >
            Report Incident
          </Link>
        </div>
      </section>      {/* Main Dashboard Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Features */}
          <div className="lg:col-span-2">            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">{/* Real-time Monitoring Row */}
                <Link to="/map" className="block hover:bg-gray-50 transition-colors">
                  <div className="flex items-center p-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Real-time Monitoring</h3>
                      <p className="text-gray-600 mt-1">Track live flood data and receive instant updates on water levels</p>
                    </div>
                  </div>
                </Link>

                {/* Safety Resources Row */}
                <Link to="/resources" className="block hover:bg-gray-50 transition-colors">
                  <div className="flex items-center p-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Safety Resources</h3>
                      <p className="text-gray-600 mt-1">Access emergency contacts and evacuation guidelines</p>
                    </div>
                  </div>
                </Link>

                {/* Report Incidents Row */}
                <Link to="/report" className="block hover:bg-gray-50 transition-colors">
                  <div className="flex items-center p-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">Report Incidents</h3>
                      <p className="text-gray-600 mt-1">Help the community by reporting flood incidents in your area</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts */}
          <div className="lg:col-span-1">            <div className="bg-red-50 rounded-lg shadow-lg overflow-hidden border border-red-200">
              <div className="border-b border-red-200 bg-red-100/50 px-6 py-4">
                <h2 className="text-xl font-bold text-red-800">
                  Active Alerts
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="bg-white border-l-4 border-red-500 p-4 rounded-md shadow-sm"
                      >
                        <p className="text-sm text-gray-900 font-medium">{alert}</p>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-center py-8 bg-white rounded-lg">
                        <p className="text-gray-500 font-medium">No active alerts at this time</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;