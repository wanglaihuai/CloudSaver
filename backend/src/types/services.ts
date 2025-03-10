import { Request } from "express";
import { ShareInfoResponse } from "./cloud115";

export interface ICloudService {
  setCookie(req: Request): Promise<void>;
  getShareInfo(shareCode: string, receiveCode?: string): Promise<ShareInfoResponse>;
  getFolderList(parentCid?: string): Promise<any>;
  saveSharedFile(params: any): Promise<any>;
}
