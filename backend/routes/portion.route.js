import { Router } from "express";
import {
  createPortion,
  deletePortion,
  getAllPortionScores,
  getPortionById,
  getPortions,
  getPortionScores,
  updatePortion,
} from "../controllers/portion.controller.js";

const router = Router();

router.post("/", createPortion);
router.get("/", getPortions);
router.get("/:id/score/:judgeId", getPortionScores);
router.get("/scores", getAllPortionScores);
router.get("/:id", getPortionById);
router.put("/:id", updatePortion);
router.delete("/:id", deletePortion);

export default router;
