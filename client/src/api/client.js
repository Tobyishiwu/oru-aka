import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("oruaka_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("oruaka_refresh_token");
    if (!refreshToken) {
      localStorage.removeItem("oruaka_access_token");
      localStorage.removeItem("oruaka_refresh_token");
      window.dispatchEvent(new Event("oruaka:logout"));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          config._retry = true;
          resolve(api(config));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      localStorage.setItem("oruaka_access_token", data.accessToken);
      onRefreshed(data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      config._retry = true;
      return api(config);
    } catch (refreshErr) {
      localStorage.removeItem("oruaka_access_token");
      localStorage.removeItem("oruaka_refresh_token");
      window.dispatchEvent(new Event("oruaka:logout"));
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
export { API_BASE_URL };
