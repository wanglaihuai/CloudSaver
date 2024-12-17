import { Request, Response, NextFunction } from "express";
import { Cloud115Service } from "../services/Cloud115Service";
import { config } from "../config";
import handleError from "../utils/handleError";
import { handleResponse } from "../utils/responseHandler";

const { cookie } = config.cloud115;

const cloud115 = new Cloud115Service(cookie);

export const cloud115Controller = {
  async getShareInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { shareCode, receiveCode } = req.query;
      const result = await cloud115.getShareInfo(shareCode as string, receiveCode as string);
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "获取分享信息失败", next);
    }
  },

  async getFolderList(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentCid } = req.query;
      const result = await cloud115.getFolderList(parentCid as string);
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "获取目录列表失败", next);
    }
  },

  async saveFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { shareCode, receiveCode, fileId, folderId } = req.body;
      const result = await cloud115.saveSharedFile({
        shareCode,
        receiveCode,
        fileId,
        cid: folderId,
      });
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "保存文件失败", next);
    }
  },
};
