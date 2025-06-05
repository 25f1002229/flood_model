import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Change if hosted remotely
});

export default api;
