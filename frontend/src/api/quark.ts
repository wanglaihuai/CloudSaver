import request from "@/utils/request";
import type { ShareInfoResponse, Folder, SaveQuarkFileParams } from "@/types";

export const quarkApi = {
  async getShareInfo(shareCode: string, receiveCode = "") {
    const { data } = await request.get<ShareInfoResponse>("/api/quark/share-info", {
      params: { shareCode, receiveCode },
    });
    return data as ShareInfoResponse;
  },

  async getFolderList(parentCid = "0") {
    const data = await request.get<Folder[]>("/api/quark/folders", {
      params: { parentCid },
    });
    return data;
  },

  async saveFile(params: SaveQuarkFileParams) {
    return await request.post("/api/quark/save", params);
  },
};
