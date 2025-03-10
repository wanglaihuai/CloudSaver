import { Application } from "express";
import { errorHandler } from "./errorHandler";
import { authMiddleware } from "./auth";
import { requestLogger } from "./requestLogger";
import { rateLimiter } from "./rateLimiter";
import { cors } from "./cors";

export const setupMiddlewares = (app: Application) => {
  app.use(cors());
  app.use(requestLogger());
  app.use(rateLimiter());
  app.use(authMiddleware);
  app.use(errorHandler);
};
