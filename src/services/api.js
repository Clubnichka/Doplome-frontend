import axios from "axios";
import { getToken } from "../utils/auth";

// Создаем экземпляр axios с добавленным токеном в заголовки
const api = axios.create({
  baseURL: "http://localhost:8080", // Базовый URL
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;