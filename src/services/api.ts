// src/services/api.ts
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api', // Ajusta según tu configuración
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Error de conexión con el servidor';
    
    console.error("Error API:", {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage
    });
    
    return Promise.reject(errorMessage);
  }
);

export default api;