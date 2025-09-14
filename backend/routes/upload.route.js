import { Router } from "express";
import {
  uploadMiddleware,
  uploadImage,
} from "../controllers/upload.controller.js";

const router = Router();

router.post("/", uploadMiddleware, uploadImage);

export default router;
