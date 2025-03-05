export interface ResourceItem {
  id: string;
  title: string;
  channel: string;
  channelId?: string;
  image?: string;
  cloudLinks: string[];
  tags?: string[];
  content?: string;
  pubDate: string;
  cloudType: string;
  messageId?: string;
}

export interface Resource {
  list: ResourceItem[];
  displayList?: boolean;
  loading?: boolean;
  channelInfo: {
    channelId: string;
    name: string;
    channelLogo: string;
  };
  id: string;
}

export interface ShareInfo {
  fileId: string;
  fileName: string;
  fileSize?: number;
  fileIdToken?: string;
  isChecked?: boolean;
}

export interface ShareInfoResponse {
  list: ShareInfo[];
  pwdId?: string;
  stoken?: string;
  shareCode?: string;
  receiveCode?: string;
  fileSize?: number;
}

export interface Folder {
  cid: string;
  name: string;
  path?: Folder[];
}

export interface SaveFileParams {
  shareCode: string;
  receiveCode: string;
  fileId: string;
  folderId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Save115FileParams {
  shareCode: string;
  receiveCode: string;
  fileId: string;
  folderId: string;
}

export interface SaveQuarkFileParams {
  fid_list: string[];
  fid_token_list: string[];
  to_pdir_fid: string;
  pwd_id: string;
  stoken: string;
  pdir_fid: string;
  scene: string;
}

export interface TagColor {
  baiduPan: string;
  weiyun: string;
  aliyun: string;
  pan115: string;
  quark: string;
}

export interface GlobalSettingAttributes {
  httpProxyHost: string;
  httpProxyPort: number | string;
  isProxyEnabled: boolean;
  AdminUserCode: number;
  CommonUserCode: number;
}
export interface UserSettingAttributes {
  cloud115Cookie: string;
  quarkCookie: string;
}
