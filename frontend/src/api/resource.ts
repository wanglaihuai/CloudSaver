import request from "@/utils/request";
import type { Resource } from "@/types/index";

export const resourceApi = {
  search(keyword: string, backupPlan: boolean, channelId?: string, lastMessageId?: string) {
    return request.get<Resource[]>(`/api/${backupPlan ? "rssSearch" : "search"}`, {
      params: { keyword, channelId, lastMessageId },
    });
  },
};
