import axios, { AxiosInstance } from "axios";
import { Request, Response } from "express";
import tunnel from "tunnel";
import GlobalSetting from "../models/GlobalSetting";
import { GlobalSettingAttributes } from "../models/GlobalSetting";

export class ImageControll {
  private axiosInstance: AxiosInstance | null = null;
  private isUpdate = false;

  constructor() {
    this.initializeAxiosInstance();
  }

  private async initializeAxiosInstance(isUpdate = false): Promise<void> {
    let settings = null;
    if (isUpdate) {
      settings = await GlobalSetting.findOne();
      this.isUpdate = isUpdate;
    } else {
      return;
    }
    const globalSetting = settings?.dataValues || ({} as GlobalSettingAttributes);
    this.axiosInstance = axios.create({
      timeout: 3000,
      httpsAgent: tunnel.httpsOverHttp({
        proxy: {
          host: globalSetting.httpProxyHost,
          port: globalSetting.httpProxyPort,
          headers: {
            "Proxy-Authorization": "",
          },
        },
      }),
      withCredentials: true,
    });
  }
  async getImages(req: Request, res: Response, url: string): Promise<void> {
    try {
      if (!this.isUpdate) await this.initializeAxiosInstance(true);
      const response = await this.axiosInstance?.get(url, { responseType: "stream" });
      res.set("Content-Type", response?.headers["content-type"]);
      response?.data.pipe(res);
    } catch (error) {
      res.status(500).send("Image fetch error");
    }
  }
}

const iamgesInstance = new ImageControll();

export const imageControll = {
  getImages: async (req: Request, res: Response): Promise<void> => {
    const url = req.query.url as string;
    iamgesInstance.getImages(req, res, url);
  },
};
