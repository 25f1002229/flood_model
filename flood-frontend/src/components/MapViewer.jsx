const MapViewer = () => (
  <div className="w-full h-[calc(100vh-4rem)] max-w-screen-2xl mx-auto px-4 py-2">
    <iframe
      src="/flood_map.html"
      title="Flood Map"
      className="w-full h-full border rounded-lg shadow-lg"
      style={{ minHeight: '600px' }}
    />
  </div>
);

export default MapViewer;
