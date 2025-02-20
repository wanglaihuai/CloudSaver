import request from "@/utils/request";
import type { ShareInfoResponse, Folder, Save115FileParams } from "@/types";

export const cloud115Api = {
  async getShareInfo(shareCode: string, receiveCode = "") {
    const { data } = await request.get<ShareInfoResponse>("/api/cloud115/share-info", {
      params: { shareCode, receiveCode },
    });
    return data as ShareInfoResponse;
  },

  async getFolderList(parentCid = "0") {
    const res = await request.get<Folder[]>("/api/cloud115/folders", {
      params: { parentCid },
    });
    return res;
  },

  async saveFile(params: Save115FileParams) {
    const res = await request.post("/api/cloud115/save", params);
    return res;
  },
};
