import React, { useState } from 'react';
import api from '../api';

const ReportFlood = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await api.post('/report', {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setMessage('Report submitted successfully!');
      setFormData({ name: '', location: '', description: '' });
    } catch (error) {
      setMessage('Error submitting report. Please try again.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Report a Flood</h2>
      {message && (
        <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <textarea
          className="border p-2 resize-none w-full rounded"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportFlood;