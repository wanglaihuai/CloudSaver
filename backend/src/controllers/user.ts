import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { UserService } from "../services/UserService";
import { BaseController } from "./BaseController";

@injectable()
export class UserController extends BaseController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {
    super();
  }

  async register(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { username, password, code } = req.body;
      return await this.userService.register(username, password, code);
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const { username, password } = req.body;
      return await this.userService.login(username, password);
    });
  }
}
