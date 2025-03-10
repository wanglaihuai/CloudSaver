import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { QuarkService } from "../services/QuarkService";
import { BaseController } from "./BaseController";

@injectable()
export class QuarkController extends BaseController {
  constructor(@inject(TYPES.QuarkService) private quarkService: QuarkService) {
    super();
  }

  async getShareInfo(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { shareCode, receiveCode } = req.query;
      await this.quarkService.setCookie(req);
      return await this.quarkService.getShareInfo(shareCode as string, receiveCode as string);
    });
  }

  async getFolderList(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { parentCid } = req.query;
      await this.quarkService.setCookie(req);
      return await this.quarkService.getFolderList(parentCid as string);
    });
  }

  async saveFile(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      await this.quarkService.setCookie(req);
      return await this.quarkService.saveSharedFile(req.body);
    });
  }
}
