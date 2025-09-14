import { Router } from "express";
import {
  createJudge,
  deleteJudge,
  getJudgeById,
  getJudges,
  updateJudge,
} from "../controllers/judge.controller.js";

const router = Router();

router.post("/", createJudge);
router.get("/", getJudges);
router.get("/:id", getJudgeById);
router.put("/:id", updateJudge);
router.delete("/:id", deleteJudge);

export default router;
