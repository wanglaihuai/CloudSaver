import { Request, Response, NextFunction } from "express";
import { RSSSearcher } from "../services/RSSSearcher";
import { Searcher } from "../services/Searcher";
import { handleResponse } from "../utils/responseHandler";
import handleError from "../utils/handleError";

export const resourceController = {
  async rssSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;
      const searcher = new RSSSearcher();
      const result = await searcher.searchAll(keyword as string);
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "获取资源发生未知错误", next);
    }
  },
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword, channelId = "", lastMessageId = "" } = req.query; // Remove `: string` from here
      const searcher = new Searcher();
      const result = await searcher.searchAll(
        keyword as string,
        channelId as string,
        lastMessageId as string
      );
      handleResponse(res, result, true);
    } catch (error) {
      handleError(res, error, "获取资源发生未知错误", next);
    }
  },
};
