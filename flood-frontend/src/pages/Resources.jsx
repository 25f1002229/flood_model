import React, { useEffect, useState } from 'react';
import api from '../api';

const Resources = () => {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Emergency Resources
      </h1>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Emergency Contact Numbers
          </h2>

          <div className="grid gap-4">
            {resources?.contacts.map((contact, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg text-center"
              >
                <p className="text-gray-900 font-medium">{contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center max-w-2xl mx-auto px-4">
        <p className="text-gray-600">
          Keep these emergency contacts handy. In case of flood emergency, contact
          the nearest authorities immediately.
        </p>
      </div>
    </div>
  );
};

export default Resources;