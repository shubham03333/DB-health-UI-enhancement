import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://135.66.159.106/api',
  // baseURL: 'http://zld06360.vci.att.com:8080/api',
  baseURL: '/api',
   headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
