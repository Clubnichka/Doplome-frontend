import { Cookies } from "react-cookie";

// Функция для получения токена из cookies
export const getToken = () => {
  const cookies = new Cookies();
  return cookies.get("token"); // или другой ключ, который используешь для хранения токена
};

// Функция для установки токена в cookies
export const setToken = (token) => {
  const cookies = new Cookies();
  cookies.set("token", token, { path: "/" });
};

// Функция для удаления токена из cookies
export const removeToken = () => {
  const cookies = new Cookies();
  cookies.remove("token", { path: "/" });
};