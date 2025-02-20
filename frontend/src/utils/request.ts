import axios, { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { RequestResult } from "../types/response";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 9000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function isLoginAndRedirect(url: string) {
  return url.includes("/api/user/login") || url.includes("/api/user/register");
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isLoginAndRedirect(config.url || "")) {
      ElMessage.error("请先登录");
      window.location.href = "/login";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    return res;
  },
  (error) => {
    if (error.response.status === 401) {
      ElMessage.error("登录过期，请重新登录");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(new Error("登录过期，请重新登录"));
    }
    ElMessage.error(error.response.statusText);
    return Promise.reject(new Error(error.response.statusText));
  }
);

const request = {
  get: <T>(
    url: string,
    config?: Record<string, any>
  ): Promise<RequestResult<T>> => {
    return axiosInstance.get(url, { ...config });
  },
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};

export default request;
