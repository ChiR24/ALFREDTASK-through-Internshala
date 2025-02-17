import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://alfredtask-through-internshala.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // Add timestamp to bypass caching
        config.params = {
            ...config.params,
            _t: Date.now()
        };
        
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CORS headers for all requests
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === 'Network Error') {
            console.error('Network error - possible causes:', {
                blocked: 'Request might be blocked by browser extension or security software',
                cors: 'Possible CORS issue',
                server: 'Server might be unreachable'
            });
            // Log additional details for debugging
            console.error('Error details:', {
                message: error.message,
                config: error.config,
                status: error.response?.status,
                headers: error.response?.headers
            });
        }
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 