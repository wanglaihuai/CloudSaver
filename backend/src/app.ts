// filepath: /d:/code/CloudDiskDown/backend/src/app.ts
import "./types/express";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { QueryTypes } from "sequelize";

// 路由和中间件导入
import routes from "./routes/api";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";

// 数据库和服务相关
import sequelize from "./config/database";
import GlobalSetting from "./models/GlobalSetting";
import Searcher from "./services/Searcher";

// 常量配置
const PUBLIC_ROUTES = ["/user/login", "/user/register"];
const IMAGE_PATH = "tele-images";
const DEFAULT_PORT = 8009;

// 全局设置默认值
const DEFAULT_GLOBAL_SETTINGS = {
  httpProxyHost: "127.0.0.1",
  httpProxyPort: 7890,
  isProxyEnabled: false,
  CommonUserCode: 9527,
  AdminUserCode: 230713,
};

class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    // CORS 配置
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      })
    );

    this.app.use(cookieParser());
    this.app.use(express.json());

    // 身份验证中间件
    this.app.use((req, res, next) => {
      if (PUBLIC_ROUTES.includes(req.path) || req.path.includes(IMAGE_PATH)) {
        return next();
      }
      authMiddleware(req, res, next);
    });
  }

  private setupRoutes(): void {
    this.app.use("/", routes);
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async initializeGlobalSettings(): Promise<void> {
    try {
      const settings = await GlobalSetting.findOne();
      if (!settings) {
        await GlobalSetting.create(DEFAULT_GLOBAL_SETTINGS);
        console.log("✅ Global settings initialized with default values.");
      }
      await Searcher.updateAxiosInstance();
    } catch (error) {
      console.error("❌ Failed to initialize global settings:", error);
      throw error;
    }
  }

  private async cleanupBackupTables(): Promise<void> {
    try {
      // 查询所有以 '_backup' 结尾的备份表
      const backupTables = await sequelize.query<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%\\_backup%' ESCAPE '\\'",
        { type: QueryTypes.SELECT }
      );

      // 逐个删除备份表
      for (const table of backupTables) {
        if (table?.name) {
          await sequelize.query(`DROP TABLE IF EXISTS ${table.name}`);
          console.log(`✅ Cleaned up backup table: ${table.name}`);
        }
      }
    } catch (error) {
      console.error("❌ Failed to cleanup backup tables:", error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      // 数据库初始化流程
      await sequelize.query("PRAGMA foreign_keys = OFF");
      console.log("📝 Foreign keys disabled for initialization...");

      await this.cleanupBackupTables();
      console.log("🧹 Backup tables cleaned up");

      await sequelize.sync({ alter: true });
      console.log("📚 Database schema synchronized");

      await sequelize.query("PRAGMA foreign_keys = ON");
      console.log("🔐 Foreign keys re-enabled");

      // 启动服务器
      const port = process.env.PORT || DEFAULT_PORT;
      this.app.listen(port, async () => {
        await this.initializeGlobalSettings();
        console.log(`
🚀 Server is running on port ${port}
🔧 Environment: ${process.env.NODE_ENV || "development"}
        `);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
}

// 创建并启动应用
const application = new App();
application.start().catch((error) => {
  console.error("❌ Application failed to start:", error);
  process.exit(1);
});

export default application;
