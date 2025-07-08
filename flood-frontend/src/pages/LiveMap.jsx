import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveMap.css';
import api from '../api';

const LiveMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  // Chennai bounds
  const CHENNAI_BOUNDS = {
    left: 80.1,    // Western longitude
    right: 80.4,   // Eastern longitude
    bottom: 12.8,  // Southern latitude
    top: 13.2      // Northern latitude
  };

  // Chennai center coordinates
  const CHENNAI_CENTER = {
    lat: 13.0827,
    lng: 80.2707
  };

  // Function to style flood zones based on risk level
  const getFloodZoneStyle = (riskLevel) => {
    const baseStyle = {
      fillOpacity: 0.5,
      weight: 2
    };    switch (riskLevel) {
      case 'high':
        return { ...baseStyle, color: '#ef4444', fillColor: '#ef4444' };
      case 'moderate':
        return { ...baseStyle, color: '#eab308', fillColor: '#eab308' };
      case 'low':
        return { ...baseStyle, color: '#22c55e', fillColor: '#22c55e' };
      default:
        return { ...baseStyle, color: '#3b82f6', fillColor: '#3b82f6' };
    }
  };

  useEffect(() => {
    const fetchFloodData = async () => {
      try {
        console.log('Fetching flood prediction data...');
        setError(null);
        const response = await api.get('/api/flood-prediction');
        console.log('Received flood data:', response.data);
        setPredictionData(response.data);
      } catch (error) {
        console.error('Error details:', error.response || error);
        setError(error.response?.data?.error || error.message);
        setLoading(false);
      }
    };

    if (!mapRef.current && mapContainerRef.current) {
      // Initialize map
      console.log('Initializing map...');
      mapRef.current = L.map(mapContainerRef.current).setView(
        [CHENNAI_CENTER.lat, CHENNAI_CENTER.lng],
        12
      );

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current);

      // Set map bounds to Chennai
      const bounds = L.latLngBounds(
        [CHENNAI_BOUNDS.bottom, CHENNAI_BOUNDS.left],
        [CHENNAI_BOUNDS.top, CHENNAI_BOUNDS.right]
      );
      mapRef.current.setMaxBounds(bounds);
      mapRef.current.fitBounds(bounds);

      // Fetch flood data after map is initialized
      fetchFloodData();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Effect to add flood zones when prediction data changes
  useEffect(() => {
    if (mapRef.current && predictionData) {
      console.log('Adding flood zones to map...');
      try {
        // Clear existing layers
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.GeoJSON) {
            mapRef.current.removeLayer(layer);
          }
        });

        // Add flood zones layer
        const floodZones = L.geoJSON(predictionData, {
          style: (feature) => {
            console.log('Styling feature:', feature);
            return getFloodZoneStyle(feature.properties.riskLevel);
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              layer.bindPopup(`
                <strong>Risk Level:</strong> ${feature.properties.riskLevel}<br>
                <strong>Warning:</strong> ${feature.properties.warning}
              `);
            }
          }
        }).addTo(mapRef.current);

        // Fit map to flood zones
        floodZones.getBounds();
        mapRef.current.fitBounds(floodZones.getBounds());
        console.log('Flood zones added successfully');
      } catch (err) {
        console.error('Error adding flood zones:', err);
        setError('Error displaying flood zones: ' + err.message);
      }
      setLoading(false);
    }
  }, [predictionData]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Flood Map</h1>
      
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-[600px]">
          <div ref={mapContainerRef} className="absolute inset-0" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="text-red-600 bg-red-100 p-4 rounded-lg shadow">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center max-w-2xl mx-auto px-4">
        <p className="text-gray-600">
          This map shows real-time flood predictions and water levels across Chennai.
          Areas in red indicate high risk zones.
        </p>
      </div>
    </div>
  );
};

export default LiveMap;