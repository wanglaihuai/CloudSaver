import { Request, Response } from "express";
import { ApiResponse } from "../core/ApiResponse";

export abstract class BaseController {
  protected async handleRequest<T>(
    req: Request,
    res: Response,
    action: () => Promise<T>
  ): Promise<void> {
    try {
      const result = await action();
      res.json(ApiResponse.success(result));
    } catch (error: any) {
      res.status(500).json(ApiResponse.error(error?.message || "未知错误"));
    }
  }
}
