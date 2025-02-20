import { Request, Response, NextFunction } from "express";
import { RSSSearcher } from "../services/RSSSearcher";
import Searcher from "../services/Searcher";
import { sendSuccess, sendError } from "../utils/response";

export const resourceController = {
  async rssSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;
      const searcher = new RSSSearcher();
      const result = await searcher.searchAll(keyword as string);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, {
        message: (error as Error).message || "RSS 搜索失败",
      });
    }
  },
  async search(req: Request, res: Response, next: NextFunction) {
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
