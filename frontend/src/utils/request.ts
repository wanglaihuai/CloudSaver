import axios, { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (!res.success) {
      ElMessage.error(res.error || "请求失败");
      return Promise.reject(new Error(res.error || "请求失败"));
    }
    return res;
  },
  (error) => {
    ElMessage.error(error.message || "网络错误");
    return Promise.reject(error);
  }
);

export default request;
