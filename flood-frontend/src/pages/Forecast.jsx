import React, { useState, useEffect } from 'react';
import api from '../api';

const Forecast = () => {
  const [shortTerm, setShortTerm] = useState(null);
  const [longTerm, setLongTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const [shortTermRes, longTermRes] = await Promise.all([
          api.get('/forecast/short-term'),
          api.get('/forecast/long-term')
        ]);
        setShortTerm(shortTermRes.data);
        setLongTerm(longTermRes.data);
      } catch (error) {
        console.error('Error fetching forecasts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  const getRiskLevelColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'moderate':
        return 'text-orange-500';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend?.includes('increasing')) {
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Flood Forecast</h1>
          <p className="text-lg text-gray-600">
            Advanced predictions and risk assessment for Chennai region
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Short Term Forecast */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Short Term Forecast
              </h2>
            </div>
            <div className="p-6">
              {shortTerm && (
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Expected Rainfall</div>
                    <div className="text-2xl font-bold text-gray-900 flex items-center">
                      <svg className="h-8 w-8 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {shortTerm.rainfall}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Prediction</div>
                    <div className="text-xl font-semibold text-gray-800">
                      {shortTerm.prediction}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="text-sm font-medium text-blue-800">
                      Take necessary precautions and stay updated with our alerts
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Long Term Forecast */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Long Term Forecast
              </h2>
            </div>
            <div className="p-6">
              {longTerm && (
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Risk Level</div>
                    <div className={`text-2xl font-bold ${getRiskLevelColor(longTerm.risk)} flex items-center`}>
                      {longTerm.risk.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Trend Analysis</div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(longTerm.trend)}
                      <span className="text-lg text-gray-800">{longTerm.trend}</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 mt-4">
                    <div className="text-sm font-medium text-indigo-800">
                      Monitor the situation regularly and follow local authorities' guidance
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Stay Informed
            </h3>
            <p className="text-gray-600">
              Regular updates through our mobile app and SMS alerts
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Kit</h3>
            <p className="text-gray-600">
              Keep essential supplies ready during high-risk periods
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Evacuation Plan</h3>
            <p className="text-gray-600">
              Know your nearest safe zones and evacuation routes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;