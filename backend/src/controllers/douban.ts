import { Request, Response, NextFunction } from "express";
import DoubanService from "../services/DoubanService";
import { sendSuccess, sendError } from "../utils/response";

const doubanService = new DoubanService();

export const doubanController = {
  async getDoubanHotList(req: Request, res: Response, next: NextFunction) {
    try {
      const { type = "movie", tag = "热门", page_limit = "50", page_start = "0" } = req.query;
      const result = await doubanService.getHotList({
        type: type as string,
        tag: tag as string,
        page_limit: page_limit as string,
        page_start: page_start as string,
      });
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, { message: "获取热门列表失败" });
    }
  },
};
