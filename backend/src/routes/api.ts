import express from "express";
import { cloud115Controller } from "../controllers/cloud115";
import { quarkController } from "../controllers/quark";
import { resourceController } from "../controllers/resource";
import { doubanController } from "../controllers/douban";
import { imageControll } from "../controllers/teleImages";
import settingRoutes from "./setting";
import userRoutes from "./user";

const router = express.Router();

// 用户相关路由
router.use("/user", userRoutes);

router.use("/tele-images", imageControll.getImages);

// 设置相关路由
router.use("/setting", settingRoutes);

// 资源搜索
router.get("/search", resourceController.search);
router.get("/rssSearch", resourceController.rssSearch);

// 115网盘相关
router.get("/cloud115/share-info", cloud115Controller.getShareInfo);
router.get("/cloud115/folders", cloud115Controller.getFolderList);
router.post("/cloud115/save", cloud115Controller.saveFile);

// 夸克网盘相关
router.get("/quark/share-info", quarkController.getShareInfo);
router.get("/quark/folders", quarkController.getFolderList);
router.post("/quark/save", quarkController.saveFile);

// 获取豆瓣热门列表
router.get("/douban/hot", doubanController.getDoubanHotList);

export default router;
