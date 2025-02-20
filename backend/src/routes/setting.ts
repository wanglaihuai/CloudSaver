import express from "express";
import { settingController } from "../controllers/setting";

const router = express.Router();

router.get("/get", settingController.get);
router.post("/save", settingController.save);

export default router;
