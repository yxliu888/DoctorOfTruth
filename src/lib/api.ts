// src/lib/api.ts

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://54.242.114.85:8081/wp-json/',
    // baseURL: 'http://localhost:8081/wordpress/wp-json/',
  // 其他配置...
});

export const getCategories = async () => {
  const response = await api.get('wp/v2/categories');
  return response.data;
};

export default api;
