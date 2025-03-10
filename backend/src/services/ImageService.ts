import { injectable } from "inversify";
import axios, { AxiosInstance } from "axios";
import tunnel from "tunnel";
import GlobalSetting from "../models/GlobalSetting";
import { GlobalSettingAttributes } from "../models/GlobalSetting";

@injectable()
export class ImageService {
  private axiosInstance: AxiosInstance | null = null;

  constructor() {
    this.initializeAxiosInstance();
  }

  private async initializeAxiosInstance(): Promise<void> {
    const settings = await GlobalSetting.findOne();
    const globalSetting = settings?.dataValues || ({} as GlobalSettingAttributes);

    this.axiosInstance = axios.create({
      timeout: 3000,
      httpsAgent: globalSetting.isProxyEnabled
        ? tunnel.httpsOverHttp({
            proxy: {
              host: globalSetting.httpProxyHost,
              port: globalSetting.httpProxyPort,
              headers: {
                "Proxy-Authorization": "",
              },
            },
          })
        : undefined,
      withCredentials: true,
    });
  }

  async getImages(url: string): Promise<any> {
    if (!this.axiosInstance) {
      throw new Error("Axios instance not initialized");
    }
    return await this.axiosInstance.get(url, { responseType: "stream" });
  }
}
