import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import Searcher from "../services/Searcher";
import UserSetting from "../models/UserSetting";
import GlobalSetting from "../models/GlobalSetting";

export const settingController = {
  async get(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      if (userId !== null) {
        let userSettings = await UserSetting.findOne({ where: { userId } });
        if (!userSettings) {
          userSettings = {
            userId: userId,
            cloud115Cookie: "",
            quarkCookie: "",
          } as UserSetting;
          if (userSettings) {
            await UserSetting.create(userSettings);
          }
        }
        const globalSetting = await GlobalSetting.findOne();
        sendSuccess(res, {
          data: {
            userSettings,
            globalSetting: role === 1 ? globalSetting : null,
          },
        });
      } else {
        sendError(res, { message: "用户ID无效" });
      }
    } catch (error) {
      console.log("获取设置失败:" + error);
      sendError(res, { message: (error as Error).message || "获取设置失败" });
    }
  },
  async save(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      if (userId !== null) {
        const { userSettings, globalSetting } = req.body;
        await UserSetting.update(userSettings, { where: { userId } });
        if (role === 1 && globalSetting) await GlobalSetting.update(globalSetting, { where: {} });
        Searcher.updateAxiosInstance();
        sendSuccess(res, {
          message: "保存成功",
        });
      }
    } catch (error) {
      console.log("保存设置失败:" + error);
      sendError(res, { message: (error as Error).message || "保存设置失败" });
    }
  },
};
