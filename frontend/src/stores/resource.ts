import { defineStore } from "pinia";
import { cloud115Api } from "@/api/cloud115";
import { resourceApi } from "@/api/resource";
import { quarkApi } from "@/api/quark";
import type { Resource, ShareInfoResponse, Save115FileParams, SaveQuarkFileParams } from "@/types";
import { ElMessage } from "element-plus";

// 定义云盘驱动配置类型
interface CloudDriveConfig {
  name: string;
  type: string;
  regex: RegExp;
  api: {
    getShareInfo: (parsedCode: any) => Promise<ShareInfoResponse>;
    saveFile: (params: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  };
  parseShareCode: (match: RegExpMatchArray) => Record<string, string>;
  getSaveParams: (shareInfo: ShareInfoResponse, folderId: string) => Record<string, any>;
}

// 云盘类型配置
export const CLOUD_DRIVES: CloudDriveConfig[] = [
  {
    name: "115网盘",
    type: "pan115",
    regex: /(?:115|anxia)\.com\/s\/([^?]+)(?:\?password=([^#]+))?/,
    api: {
      getShareInfo: (parsedCode: { shareCode: string; receiveCode: string }) =>
        cloud115Api.getShareInfo(parsedCode.shareCode, parsedCode.receiveCode),
      saveFile: (params) => cloud115Api.saveFile(params as Save115FileParams),
    },
    parseShareCode: (match) => ({
      shareCode: match[1],
      receiveCode: match[2] || "",
    }),
    getSaveParams: (shareInfo, folderId) => ({
      shareCode: shareInfo.data.shareCode,
      receiveCode: shareInfo.data.receiveCode,
      fileId: shareInfo.data.list[0].fileId,
      folderId,
    }),
  },
  {
    name: "夸克网盘",
    type: "quark",
    regex: /pan\.quark\.cn\/s\/([a-zA-Z0-9]+)/,
    api: {
      getShareInfo: (parsedCode: { pwdId: string }) => quarkApi.getShareInfo(parsedCode.pwdId),
      saveFile: (params) => quarkApi.saveFile(params as SaveQuarkFileParams),
    },
    parseShareCode: (match) => ({ pwdId: match[1] }),
    getSaveParams: (shareInfo, folderId) => ({
      fid_list: shareInfo.data.list.map((item) => item.fileId || ""),
      fid_token_list: shareInfo.data.list.map((item) => item.fileIdToken || ""),
      to_pdir_fid: folderId,
      pwd_id: shareInfo.data.pwdId || "",
      stoken: shareInfo.data.stoken || "",
      pdir_fid: "0",
      scene: "link",
    }),
  },
];

export const useResourceStore = defineStore("resource", {
  state: () => ({
    resources: [] as Resource[],
    selectedResources: [] as Resource[],
    loading: false,
    lastKeyWord: "",
    backupPlan: false,
  }),

  actions: {
    // 搜索资源
    async searchResources(
      keyword?: string,
      backupPlan = false,
      isLoadMore = false,
      channelId?: string,
      lastMessageId?: string
    ): Promise<void> {
      this.loading = true;
      if (!isLoadMore) this.resources = [];
      try {
        if (isLoadMore) {
          if (!lastMessageId) {
            ElMessage.error("当次搜索源不支持加载更多");
            return;
          }
          keyword = this.lastKeyWord;
          backupPlan = this.backupPlan;
        }
        const { data } = await resourceApi.search(
          keyword || "",
          backupPlan,
          channelId,
          lastMessageId
        );
        this.lastKeyWord = keyword || "";
        if (isLoadMore) {
          this.resources.push(
            ...data.filter(
              (item) => !this.selectedResources.some((selectedItem) => selectedItem.id === item.id)
            )
          );
        } else {
          this.resources = data;
        }
      } catch (error) {
        this.handleError("搜索失败，请重试", error);
      } finally {
        this.loading = false;
      }
    },

    // 转存资源
    async saveResource(resource: Resource, folderId: string): Promise<void> {
      try {
        const savePromises: Promise<void>[] = [];
        CLOUD_DRIVES.forEach((drive) => {
          if (resource.cloudLinks.some((link) => drive.regex.test(link))) {
            savePromises.push(this.saveResourceToDrive(resource, folderId, drive));
          }
        });
        await Promise.all(savePromises);
      } catch (error) {
        this.handleError("转存失败，请重试", error);
      }
    },

    // 保存资源到网盘
    async saveResourceToDrive(
      resource: Resource,
      folderId: string,
      drive: CloudDriveConfig
    ): Promise<void> {
      const link = resource.cloudLinks.find((link) => drive.regex.test(link));
      if (!link) return;

      const match = link.match(drive.regex);
      if (!match) throw new Error("链接解析失败");

      const parsedCode = drive.parseShareCode(match);
      try {
        let shareInfo = await drive.api.getShareInfo(parsedCode);
        if (shareInfo?.data) {
          shareInfo = {
            ...shareInfo,
            data: {
              ...shareInfo.data,
              ...parsedCode,
            },
          };
        }
        const params = drive.getSaveParams(shareInfo, folderId);
        const result = await drive.api.saveFile(params);

        if (result.success) {
          ElMessage.success(`${drive.name} 转存成功`);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : `${drive.name} 转存失败`);
      }
    },

    // 解析云盘链接
    async parsingCloudLink(url: string): Promise<void> {
      this.loading = true;
      this.resources = [];
      try {
        const matchedDrive = CLOUD_DRIVES.find((drive) => drive.regex.test(url));
        if (!matchedDrive) throw new Error("不支持的网盘链接");

        const match = url.match(matchedDrive.regex);
        if (!match) throw new Error("链接解析失败");

        const parsedCode = matchedDrive.parseShareCode(match);
        const shareInfo = await matchedDrive.api.getShareInfo(parsedCode);

        if (shareInfo?.data?.list?.length) {
          this.resources = [
            {
              id: "1",
              title: shareInfo.data.list.map((item) => item.fileName).join(", "),
              cloudLinks: [url],
              cloudType: matchedDrive.type,
              channel: matchedDrive.name,
              pubDate: "",
            },
          ];
        } else {
          throw new Error("解析失败，请检查链接是否正确");
        }
      } catch (error) {
        this.handleError("解析失败，请重试", error);
      } finally {
        this.loading = false;
      }
    },

    // 统一错误处理
    handleError(message: string, error: unknown): void {
      console.error(message, error);
      ElMessage.error(error instanceof Error ? error.message : message);
    },
  },
});
