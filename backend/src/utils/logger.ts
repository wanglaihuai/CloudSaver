type LogLevel = "info" | "success" | "warn" | "error";

export const Logger = {
  info(...args: any[]) {
    this.log("info", ...args);
  },

  success(...args: any[]) {
    this.log("success", ...args);
  },

  warn(...args: any[]) {
    this.log("warn", ...args);
  },

  error(...args: any[]) {
    this.log("error", ...args);
  },

  log(level: LogLevel, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "success":
        console.log(prefix, ...args);
        break;
      case "warn":
        console.warn(prefix, ...args);
        break;
      case "error":
        console.error(prefix, ...args);
        break;
      default:
        console.log(prefix, ...args);
    }
  },
};
