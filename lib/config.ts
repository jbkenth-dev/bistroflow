// lib/config.ts

const IS_PROD = process.env.NODE_ENV === 'production';

// Replace this URL with your actual InfinityFree/backend URL when you deploy
const PROD_API_URL = 'http://your-backend-domain.com/bistroflow/php-backend/public/api';
const DEV_API_URL = 'http://localhost/bistroflow/bistroflow/php-backend/public/api';

export const API_BASE_URL = IS_PROD ? PROD_API_URL : DEV_API_URL;

export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
