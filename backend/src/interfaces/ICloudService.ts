import {
  ShareInfoResponse,
  FolderListResponse,
  SaveFileParams,
  SaveFileResponse,
} from "../types/cloud";

export interface ICloudService {
  getShareInfo(shareCode: string, receiveCode?: string): Promise<ShareInfoResponse>;
  getFolderList(parentCid?: string): Promise<FolderListResponse>;
  saveSharedFile(params: SaveFileParams): Promise<SaveFileResponse>;
}
