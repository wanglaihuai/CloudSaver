import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import GlobalSetting from "../models/GlobalSetting";
import User from "../models/User";
import { config } from "../config";
import { sendSuccess, sendError } from "../utils/response";

const isValidInput = (input: string): boolean => {
  // 检查是否包含空格或汉字
  const regex = /^[^\s\u4e00-\u9fa5]+$/;
  return regex.test(input);
};
export const userController = {
  async register(req: Request, res: Response) {
    const { username, password, registerCode } = req.body;
    const globalSetting = await GlobalSetting.findOne();
    const registerCodeList = [
      globalSetting?.dataValues.CommonUserCode,
      globalSetting?.dataValues.AdminUserCode,
    ];
    if (!registerCode || !registerCodeList.includes(Number(registerCode))) {
      return sendError(res, { message: "注册码错误" });
    }
    // 验证输入
    if (!isValidInput(username) || !isValidInput(password)) {
      return sendError(res, { message: "用户名、密码或注册码不能包含空格或汉字" });
    }
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return sendError(res, { message: "用户名已存在" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const role = registerCodeList.findIndex((x) => x === Number(registerCode));
      const user = await User.create({ username, password: hashedPassword, role });
      sendSuccess(res, {
        data: user,
        message: "用户注册成功",
      });
    } catch (error: any) {
      sendError(res, { message: error.message || "用户注册失败" });
    }
  },

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendError(res, { message: "用户名或密码错误" });
    }
    const token = jwt.sign({ userId: user.userId, role: user.role }, config.jwtSecret, {
      expiresIn: "6h",
    });
    sendSuccess(res, {
      data: {
        token,
      },
    });
  },
};
