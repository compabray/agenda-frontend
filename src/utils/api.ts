import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // ajusta si cambia tu puerto/backend
  headers: {
    'Content-Type': 'application/json'
  }
});
