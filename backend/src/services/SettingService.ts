import { injectable } from "inversify";
import UserSetting from "../models/UserSetting";
import GlobalSetting from "../models/GlobalSetting";
import { Searcher } from "./Searcher";

@injectable()
export class SettingService {
  async getSettings(userId: number | undefined, role: number | undefined) {
    if (!userId) {
      throw new Error("用户ID无效");
    }

    let userSettings = await UserSetting.findOne({ where: { userId: userId.toString() } });
    if (!userSettings) {
      userSettings = await UserSetting.create({
        userId: userId.toString(),
        cloud115Cookie: "",
        quarkCookie: "",
      });
    }

    const globalSetting = await GlobalSetting.findOne();
    return {
      data: {
        userSettings,
        globalSetting: role === 1 ? globalSetting : null,
      },
    };
  }

  async saveSettings(userId: number | undefined, role: number | undefined, settings: any) {
    if (!userId) {
      throw new Error("用户ID无效");
    }

    const { userSettings, globalSetting } = settings;
    await UserSetting.update(userSettings, { where: { userId: userId.toString() } });

    if (role === 1 && globalSetting) {
      await GlobalSetting.update(globalSetting, { where: {} });
    }

    await Searcher.updateAxiosInstance();
    return { message: "保存成功" };
  }
}
