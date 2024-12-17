export interface ShareInfo {
  fileId: string;
  fileName: string;
  fileSize: number;
}

export interface ShareInfoResponse {
  success: boolean;
  data?: {
    list: ShareInfo[];
  };
  error?: string;
}
