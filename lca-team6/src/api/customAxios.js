import axios from 'axios';

const customAxios = axios.create({
  baseURL: "http://localhost:8080" + "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else {
      config.headers.Authorization = null;
    }
    return config;
  }
);

// 응답 인터셉터
customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      alert(error.response.status);
    }
    return Promise.reject(error);
  }
);

export default customAxios;
