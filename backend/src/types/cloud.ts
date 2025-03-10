export interface ShareInfoResponse {
  data: {
    fileId: string;
    fileName: string;
    fileSize: number;
  }[];
}

export interface FolderListResponse {
  data: {
    cid: string;
    name: string;
    path: { cid: string; name: string }[];
  }[];
}

export interface SaveFileParams {
  shareCode: string;
  receiveCode?: string;
  fileId: string;
  cid?: string;
}

export interface SaveFileResponse {
  message: string;
  data: unknown;
}
