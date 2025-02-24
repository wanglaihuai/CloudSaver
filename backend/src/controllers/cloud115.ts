import { Request, Response } from "express";
import { Cloud115Service } from "../services/Cloud115Service";
import { sendSuccess, sendError } from "../utils/response";
import UserSetting from "../models/UserSetting";

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

export const cloud115Controller = {
  async getShareInfo(req: Request, res: Response): Promise<void> {
    try {
      const { shareCode, receiveCode } = req.query;
      await setCookie(req);
      const result = await cloud115.getShareInfo(shareCode as string, receiveCode as string);
      sendSuccess(res, result);
    } catch (error) {
      console.log(error);
      sendError(res, { message: (error as Error).message || "获取分享信息失败" });
    }
  },

  async getFolderList(req: Request, res: Response): Promise<void> {
    try {
      const { parentCid } = req.query;
      await setCookie(req);
      const result = await cloud115.getFolderList(parentCid as string);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: (error as Error).message || "获取目录列表失败" });
    }
  },

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
  },
};

export const Cloud115ServiceInstance = cloud115;
