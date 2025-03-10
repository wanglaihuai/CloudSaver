import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { QuarkService } from "../services/QuarkService";
import { BaseController } from "./BaseController";
import { sendSuccess } from "../utils/response";

@injectable()
export class QuarkController extends BaseController {
  constructor(@inject(TYPES.QuarkService) private quarkService: QuarkService) {
    super();
  }

  async getShareInfo(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { shareCode, receiveCode } = req.query;
      await this.quarkService.setCookie(req);
      const result = await this.quarkService.getShareInfo(
        shareCode as string,
        receiveCode as string
      );
      sendSuccess(res, result);
    });
  }

  async getFolderList(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { parentCid } = req.query;
      await this.quarkService.setCookie(req);
      const result = await this.quarkService.getFolderList(parentCid as string);
      sendSuccess(res, result);
    });
  }

  async saveFile(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      await this.quarkService.setCookie(req);
      const result = await this.quarkService.saveSharedFile(req.body);
      sendSuccess(res, result);
    });
  }
}
