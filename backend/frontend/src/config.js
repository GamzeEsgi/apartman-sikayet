// API URL - production'da environment variable veya otomatik algılama kullanılır
const getApiUrl = () => {
  // Environment variable varsa onu kullan (build zamanında set edilir)
  if (process.env.REACT_APP_API_URL) {
    console.log('API URL (env):', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Production'da (Vercel) otomatik olarak mevcut domain'i kullan
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log('API URL (auto):', origin);
    return origin;
  }
  
  // Development için localhost
  console.log('API URL (default):', 'http://localhost:5000');
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();
console.log('Final API_URL:', API_URL);

export default API_URL;




