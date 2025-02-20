import { defineStore } from "pinia";
import type { UserSettingStore } from "@/types/user";
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
    async saveSettings() {
      if (this.userSettings) {
        const setting: UserSettingStore = {
          userSettings: this.userSettings,
        };
        if (this.globalSetting) setting.globalSetting = this.globalSetting;
        const res = await settingApi.saveSetting(setting);
        if (res) {
          this.getSettings();
          ElMessage.success("保存成功");
        }
      }
    },
    setDisplayStyle(style: "table" | "card") {
      this.displayStyle = style;
      ElMessage.success(`切换成功，当前为${style}模式`);
    },
  },
});
