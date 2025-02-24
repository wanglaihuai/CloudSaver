import { Request, Response } from "express";
import Searcher from "../services/Searcher";
import { sendSuccess, sendError } from "../utils/response";

export const resourceController = {
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { keyword, channelId = "", lastMessageId = "" } = req.query; // Remove `: string` from here
      const result = await Searcher.searchAll(
        keyword as string,
        channelId as string,
        lastMessageId as string
      );
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, {
        message: (error as Error).message || "搜索资源失败",
      });
    }
  },
};
