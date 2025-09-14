import { Router } from "express";
import {
  deleteScore,
  getScore,
  getScoreById,
  insertScore,
  updateScore,
} from "../controllers/score.controller.js";

const router = Router();

router.post("/", insertScore);
router.get("/", getScore);
router.get("/:id", getScoreById);
router.put("/:id", updateScore);
router.delete("/:id", deleteScore);

export default router;
