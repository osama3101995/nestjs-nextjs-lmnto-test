import axios, { AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;
    
    let errorMessage = 'Unknown Error';
    let validationErrors: Record<string, string> | null = null;

    if (responseData) {
      if (Array.isArray(responseData.message)) {
        errorMessage = 'Validation Failed';
        validationErrors = responseData.message.reduce((acc: any, err: string) => {
          const [field] = err.split(' ');
          acc[field] = err;
          return acc;
        }, {});
      } else {
        errorMessage = responseData.message || error.message;
      }
    }

    const errorData = {
      status: error.response?.status,
      message: errorMessage,
      errors: validationErrors,
      path: error.config?.url,
      raw: responseData
    };

    console.error('[API ERROR]:', errorData);
    return Promise.reject(errorData);
  }
);