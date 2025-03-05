import { defineStore } from "pinia";
import type {
  UserSettingStore,
  GlobalSettingAttributes,
  UserSettingAttributes,
} from "@/types/user";
import { settingApi } from "@/api/setting";
import { ElMessage } from "element-plus";

export const useUserSettingStore = defineStore("user", {
  state: (): UserSettingStore => ({
    globalSetting: null,
    userSettings: {
      cloud115Cookie: "",
      quarkCookie: "",
    },
    displayStyle: "card",
  }),

  actions: {
    async getSettings() {
      const { data } = await settingApi.getSetting();
      if (data) {
        this.globalSetting = data.globalSetting;
        this.userSettings = data.userSettings;
      }
    },

    async saveSettings(settings: {
      globalSetting?: GlobalSettingAttributes | null;
      userSettings: UserSettingAttributes;
    }) {
      try {
        await settingApi.saveSetting(settings);
        await this.getSettings();
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    setDisplayStyle(style: "table" | "card") {
      this.displayStyle = style;
      ElMessage.success(`切换成功，当前为${style}模式`);
    },
  },
});
