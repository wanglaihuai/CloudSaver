import { GlobalSettingAttributes, UserSettingAttributes } from "@/types";
export interface UserSettingStore {
  globalSetting?: GlobalSettingAttributes | null;
  userSettings: UserSettingAttributes;
  displayStyle?: "table" | "card";
}
