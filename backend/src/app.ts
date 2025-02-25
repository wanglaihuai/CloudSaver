// filepath: /d:/code/CloudDiskDown/backend/src/app.ts
import "./types/express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/api";
import { errorHandler } from "./middleware/errorHandler";
import sequelize from "./config/database";
import { authMiddleware } from "./middleware/auth";
import GlobalSetting from "./models/GlobalSetting";
import Searcher from "./services/Searcher";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(cookieParser());
app.use(express.json());

// 应用 token 验证中间件，排除登录和注册接口
app.use((req, res, next) => {
  if (
    req.path === "/user/login" ||
    req.path === "/user/register" ||
    req.path.includes("tele-images")
  ) {
    return next();
  }
  authMiddleware(req, res, next);
});

app.use("/", routes);

const initializeGlobalSettings = async (): Promise<void> => {
  const settings = await GlobalSetting.findOne();
  if (!settings) {
    await GlobalSetting.create({
      httpProxyHost: "127.0.0.1",
      httpProxyPort: 7890,
      isProxyEnabled: true,
      CommonUserCode: 9527,
      AdminUserCode: 230713,
    });
    console.log("Global settings initialized with default values.");
  }
  await Searcher.updateAxiosInstance();
};

// 错误处理
app.use(errorHandler);

const PORT = process.env.PORT || 8009;

// 在同步前禁用外键约束，同步后重新启用
sequelize
  .query("PRAGMA foreign_keys = OFF") // 禁用外键
  .then(() => sequelize.sync({ alter: true }))
  .then(() => sequelize.query("PRAGMA foreign_keys = ON")) // 重新启用外键
  .then(() => {
    app.listen(PORT, async () => {
      await initializeGlobalSettings();
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database sync failed:", error);
  });

export default app;
