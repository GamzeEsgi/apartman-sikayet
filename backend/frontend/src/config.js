// API URL - production'da environment variable veya otomatik algılama kullanılır
const getApiUrl = () => {
  // Environment variable varsa onu kullan
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Production'da (Vercel) otomatik olarak mevcut domain'i kullan
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  
  // Development için localhost
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

export default API_URL;




