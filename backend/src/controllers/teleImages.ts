import axios, { AxiosInstance } from "axios";
import e, { Request, Response } from "express";
import tunnel from "tunnel";
import GlobalSetting from "../models/GlobalSetting";
import { GlobalSettingAttributes } from "../models/GlobalSetting";

export class ImageControll {
  private axiosInstance: AxiosInstance | null = null;
  private settings: GlobalSetting | null = null;

  constructor() {
    this.initializeAxiosInstance();
  }

  private async initializeAxiosInstance(): Promise<void> {
    try {
      this.settings = await GlobalSetting.findOne();
    } catch (error) {
      console.error("Error fetching global settings:", error);
    }
    const globalSetting = this.settings?.dataValues || ({} as GlobalSettingAttributes);
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
  public async updateProxyConfig(): Promise<void> {
    try {
      this.settings = await GlobalSetting.findOne();
      const globalSetting = this.settings?.dataValues || ({} as GlobalSettingAttributes);
      if (this.axiosInstance) {
        this.axiosInstance.defaults.httpsAgent = globalSetting.isProxyEnabled
          ? tunnel.httpsOverHttp({
              proxy: {
                host: globalSetting.httpProxyHost,
                port: globalSetting.httpProxyPort,
                headers: {
                  "Proxy-Authorization": "",
                },
              },
            })
          : undefined;
      }
    } catch (error) {
      console.error("Error updating proxy config:", error);
    }
  }

  async getImages(req: Request, res: Response, url: string): Promise<void> {
    try {
      const response = await this.axiosInstance?.get(url, { responseType: "stream" });
      res.set("Content-Type", response?.headers["content-type"]);
      response?.data.pipe(res);
    } catch (error) {
      res.status(500).send("Image fetch error");
    }
  }
}

export const iamgesInstance = new ImageControll();

export const imageControll = {
  getImages: async (req: Request, res: Response): Promise<void> => {
    const url = req.query.url as string;
    iamgesInstance.getImages(req, res, url);
  },
};
