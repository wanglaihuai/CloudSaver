import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import tunnel from "tunnel";
import { config } from "../config";

export function createAxiosInstance(
  baseURL: string,
  headers: AxiosRequestHeaders,
  useProxy: boolean = false
): AxiosInstance {
  let agent;

  if (useProxy) {
    agent = tunnel.httpsOverHttp({
      proxy: {
        host: config.httpProxy.host,
        port: Number(config.httpProxy.port),
      },
    });
  }

  return axios.create({
    baseURL,
    timeout: 30000,
    headers,
    httpsAgent: useProxy ? agent : undefined,
    withCredentials: true,
  });
}
