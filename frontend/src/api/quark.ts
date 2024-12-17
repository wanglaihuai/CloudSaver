import request from "@/utils/request";
import type { ShareInfoResponse, Folder, SaveQuarkFileParams } from "@/types";

export const quarkApi = {
  async getShareInfo(pwdId: string, passcode = ""): Promise<ShareInfoResponse> {
    const { data } = await request.get("/api/quark/share-info", {
      params: { pwdId, passcode },
    });
    return data;
  },

  async getFolderList(parentCid = "0"): Promise<{ data: Folder[] }> {
    const { data } = await request.get("/api/quark/folders", {
      params: { parentCid },
    });
    return data;
  },

  async saveFile(params: SaveQuarkFileParams) {
    const { data } = await request.post("/api/quark/save", params);
    return data;
  },
};
