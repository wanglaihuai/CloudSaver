export class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code: number;

  private constructor(success: boolean, code: number, data?: T, message?: string) {
    this.success = success;
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(data?: T, message = "操作成功"): ApiResponse<T> {
    return new ApiResponse(true, 200, data, message);
  }

  static error(message: string, code = 500): ApiResponse<null> {
    return new ApiResponse(false, code, null, message);
  }
}
