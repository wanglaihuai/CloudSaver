import { AxiosHeaders, AxiosInstance } from "axios"; // 导入 AxiosHeaders
import { createAxiosInstance } from "../utils/axiosInstance";
import { Logger } from "../utils/logger";
import { ShareInfoResponse } from "../types/cloud115";

interface Cloud115ListItem {
  cid: string;
  n: string;
  s: number;
}

interface Cloud115FolderItem {
  cid: string;
  n: string;
  ns: number;
}

interface Cloud115PathItem {
  cid: string;
  name: string;
}

export class Cloud115Service {
  private api: AxiosInstance;
  private cookie: string = "";

  constructor(cookie?: string) {
    this.api = createAxiosInstance(
      "https://webapi.115.com",
      AxiosHeaders.from({
        Host: "webapi.115.com",
        Connection: "keep-alive",
        xweb_xhr: "1",
        Origin: "",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF MacWechat/3.8.9(0x13080910) XWEB/1227",
        Accept: "*/*",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        Referer: "https://servicewechat.com/wx2c744c010a61b0fa/94/page-frame.html",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
      })
    );
    if (cookie) {
      this.setCookie(cookie);
    } else {
      console.log("请注意:115网盘需要提供cookie进行身份验证");
    }
    this.api.interceptors.request.use((config) => {
      config.headers.cookie = cookie || this.cookie;
      return config;
    });
  }

  public setCookie(cookie: string): void {
    this.cookie = cookie;
  }

  async getShareInfo(shareCode: string, receiveCode = ""): Promise<ShareInfoResponse> {
    const response = await this.api.get("/share/snap", {
      params: {
        share_code: shareCode,
        receive_code: receiveCode,
        offset: 0,
        limit: 20,
        cid: "",
      },
    });
    if (response.data?.state && response.data.data?.list?.length > 0) {
      return {
        data: response.data.data.list.map((item: Cloud115ListItem) => ({
          fileId: item.cid,
          fileName: item.n,
          fileSize: item.s,
        })),
      };
    }
    throw new Error("未找到文件信息");
  }

  async getFolderList(
    parentCid = "0"
  ): Promise<{ data: { cid: string; name: string; path: Cloud115PathItem[] }[] }> {
    const response = await this.api.get("/files", {
      params: {
        aid: 1,
        cid: parentCid,
        o: "user_ptime",
        asc: 1,
        offset: 0,
        show_dir: 1,
        limit: 50,
        type: 0,
        format: "json",
        star: 0,
        suffix: "",
        natsort: 0,
        snap: 0,
        record_open_time: 1,
        fc_mix: 0,
      },
    });
    if (response.data?.state) {
      return {
        data: response.data.data
          .filter((item: Cloud115FolderItem) => item.cid && !!item.ns)
          .map((folder: Cloud115FolderItem) => ({
            cid: folder.cid,
            name: folder.n,
            path: response.data.path,
          })),
      };
    } else {
      Logger.error("获取目录列表失败:", response.data.error);
      throw new Error("获取115pan目录列表失败:" + response.data.error);
    }
  }

  async saveSharedFile(params: {
    cid: string;
    shareCode: string;
    receiveCode: string;
    fileId: string;
  }): Promise<{ message: string; data: unknown }> {
    const param = new URLSearchParams({
      cid: params.cid,
      share_code: params.shareCode,
      receive_code: params.receiveCode,
      file_id: params.fileId,
    });
    const response = await this.api.post("/share/receive", param.toString());
    Logger.info("保存文件:", response.data);
    if (response.data.state) {
      return {
        message: response.data.error,
        data: response.data.data,
      };
    } else {
      Logger.error("保存文件失败:", response.data.error);
      throw new Error("保存115pan文件失败:" + response.data.error);
    }
  }
}
