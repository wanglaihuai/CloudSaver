import express from "express";
import { cloud115Controller } from "../controllers/cloud115";
import { quarkController } from "../controllers/quark";
import { resourceController } from "../controllers/resource";

const router = express.Router();

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

export default router;
