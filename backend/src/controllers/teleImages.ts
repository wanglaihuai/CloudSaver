import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { ImageService } from "../services/ImageService";
import { BaseController } from "./BaseController";

@injectable()
export class ImageController extends BaseController {
  constructor(@inject(TYPES.ImageService) private imageService: ImageService) {
    super();
  }

  async getImages(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const url = req.query.url as string;
      return await this.imageService.getImages(url);
    });
  }
}
