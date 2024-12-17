import { Response, NextFunction } from "express";
import { Logger } from "../utils/logger";
export default function handleError(
  res: Response,
  error: any,
  message: string,
  next: NextFunction
) {
  Logger.error(message, error);
  next(error || { success: false, message });
}
