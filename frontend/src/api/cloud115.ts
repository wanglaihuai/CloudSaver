import request from "@/utils/request";
import type { ShareInfoResponse, Folder, Save115FileParams } from "@/types";

export const cloud115Api = {
  async getShareInfo(shareCode: string, receiveCode = ""): Promise<ShareInfoResponse> {
    const { data } = await request.get("/api/cloud115/share-info", {
      params: { shareCode, receiveCode },
    });
    return data;
  },

  async getFolderList(parentCid = "0"): Promise<{ data: Folder[] }> {
    const { data } = await request.get("/api/cloud115/folders", {
      params: { parentCid },
    });
    return data;
  },

  async saveFile(params: Save115FileParams) {
    const { data } = await request.post("/api/cloud115/save", params);
    return data;
  },
};
