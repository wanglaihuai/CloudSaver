import { Request, Response, NextFunction } from "express";
import { QuarkService } from "../services/QuarkService";
import { sendSuccess, sendError } from "../utils/response";
import UserSetting from "../models/UserSetting";

const quark = new QuarkService();

const setCookie = async (req: Request) => {
  const userId = req.user?.userId;
  const userSetting = await UserSetting.findOne({
    where: { userId },
  });
  if (userSetting && userSetting.dataValues.quarkCookie) {
    quark.setCookie(userSetting.dataValues.quarkCookie);
  } else {
    throw new Error("请先设置夸克网盘cookie");
  }
};

export const quarkController = {
  async getShareInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { pwdId, passcode } = req.query;
      await setCookie(req);
      const result = await quark.getShareInfo(pwdId as string, passcode as string);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: "获取分享信息失败" });
    }
  },

  async getFolderList(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentCid } = req.query;
      await setCookie(req);
      const result = await quark.getFolderList(parentCid as string);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: (error as Error).message || "获取目录列表失败" });
    }
  },

  async saveFile(req: Request, res: Response, next: NextFunction) {
    try {
      await setCookie(req);
      const result = await quark.saveSharedFile(req.body);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: (error as Error).message || "保存文件失败" });
    }
  },
};
