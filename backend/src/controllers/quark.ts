import { Request, Response, NextFunction } from "express";
import { QuarkService } from "../services/QuarkService";
import { config } from "../config";
import { handleResponse } from "../utils/responseHandler";
import handleError from "../utils/handleError";

const { cookie } = config.quark;

const quark = new QuarkService(cookie);

export const quarkController = {
  async getShareInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { pwdId, passcode } = req.query;
      const result = await quark.getShareInfo(pwdId as string, passcode as string);
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "获取分享信息失败", next);
    }
  },

  async getFolderList(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentCid } = req.query;
      const result = await quark.getFolderList(parentCid as string);
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "获取目录列表失败", next);
    }
  },

  async saveFile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await quark.saveSharedFile(req.body);
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "保存文件失败", next);
    }
  },
};
