import { Request, Response } from "express";
import { Cloud115Service } from "../services/Cloud115Service";
import { sendSuccess, sendError } from "../utils/response";
import UserSetting from "../models/UserSetting";
import { BaseController } from "./BaseController";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";

const cloud115 = new Cloud115Service();
const setCookie = async (req: Request): Promise<void> => {
  const userId = req.user?.userId;
  const userSetting = await UserSetting.findOne({
    where: { userId },
  });
  if (userSetting && userSetting.dataValues.cloud115Cookie) {
    cloud115.setCookie(userSetting.dataValues.cloud115Cookie);
  } else {
    throw new Error("请先设置115网盘cookie");
  }
};

@injectable()
export class Cloud115Controller extends BaseController {
  constructor(@inject(TYPES.Cloud115Service) private cloud115Service: Cloud115Service) {
    super();
  }

  async getShareInfo(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { shareCode, receiveCode } = req.query;
      await this.cloud115Service.setCookie(req);
      return await this.cloud115Service.getShareInfo(shareCode as string, receiveCode as string);
    });
  }

  async getFolderList(req: Request, res: Response): Promise<void> {
    try {
      const { parentCid } = req.query;
      await setCookie(req);
      const result = await cloud115.getFolderList(parentCid as string);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: (error as Error).message || "获取目录列表失败" });
    }
  }

  async saveFile(req: Request, res: Response): Promise<void> {
    try {
      const { shareCode, receiveCode, fileId, folderId } = req.body;
      await setCookie(req);
      const result = await cloud115.saveSharedFile({
        shareCode,
        receiveCode,
        fileId,
        cid: folderId,
      });
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: (error as Error).message || "保存文件失败" });
    }
  }
}

export const Cloud115ServiceInstance = cloud115;
