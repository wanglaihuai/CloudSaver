import { Request, Response } from "express";
import { Cloud115Service } from "../services/Cloud115Service";
import { BaseController } from "./BaseController";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";

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
    await this.handleRequest(req, res, async () => {
      const { parentCid } = req.query;
      await this.cloud115Service.setCookie(req);
      return await this.cloud115Service.getFolderList(parentCid as string);
    });
  }

  async saveFile(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { shareCode, receiveCode, fileId, folderId } = req.body;
      await this.cloud115Service.setCookie(req);
      return await this.cloud115Service.saveSharedFile({
        shareCode,
        receiveCode,
        fileId,
        cid: folderId,
      });
    });
  }
}
