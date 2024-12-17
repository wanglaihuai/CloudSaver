import { AxiosHeaders, AxiosInstance } from "axios"; // 导入 AxiosHeaders
import { createAxiosInstance } from "../utils/axiosInstance";
import { Logger } from "../utils/logger";
import { config } from "../config/index";
import { ShareInfoResponse } from "../types/cloud115";

export class Cloud115Service {
  private api: AxiosInstance;

  constructor(cookie: string) {
    if (!cookie) {
      throw new Error("115网盘需要提供cookie进行身份验证");
    }

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
        cookie: cookie,
      })
    );
  }

  async getShareInfo(shareCode: string, receiveCode = ""): Promise<ShareInfoResponse> {
    try {
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
          success: true,
          data: {
            list: response.data.data.list.map((item: any) => ({
              fileId: item.cid,
              fileName: item.n,
              fileSize: item.s,
            })),
          },
        };
      }

      return {
        success: false,
        error: "未找到文件信息",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  async getFolderList(parentCid = "0") {
    try {
      const response = await this.api.get("/files", {
        params: {
          aid: 1,
          cid: parentCid,
          o: "user_ptime",
          asc: 0,
          offset: 0,
          show_dir: 1,
          limit: 50,
          type: 0,
          format: "json",
          star: 0,
          suffix: "",
          natsort: 1,
        },
      });

      if (response.data?.state) {
        return {
          success: true,
          data: response.data.data
            .filter((item: any) => item.cid)
            .map((folder: any) => ({
              cid: folder.cid,
              name: folder.n,
              path: response.data.path,
            })),
        };
      } else {
        Logger.error("获取目录列表失败:", response.data.error);
        return {
          success: false,
          error: "获取115pan目录列表失败:" + response.data.error,
        };
      }
    } catch (error) {
      Logger.error("获取目录列表失败:", error);
      return {
        success: false,
        error: "获取115pan目录列表失败",
      };
    }
  }

  async saveSharedFile(params: {
    cid: string;
    shareCode: string;
    receiveCode: string;
    fileId: string;
  }) {
    try {
      const param = new URLSearchParams({
        cid: params.cid,
        user_id: config.cloud115.userId,
        share_code: params.shareCode,
        receive_code: params.receiveCode,
        file_id: params.fileId,
      });
      const response = await this.api.post("/share/receive", param.toString());

      return {
        success: response.data.state,
        error: response.data.error,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }
}
