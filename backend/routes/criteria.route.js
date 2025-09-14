import { Router } from "express";
import {
  createCriteria,
  deleteCriteria,
  getCriteriaById,
  getCriteriaScores,
  updateCriteria,
} from "../controllers/criteria.controller.js";

const router = Router();

router.post("/", createCriteria);
router.get("/:id", getCriteriaById);
router.get("/:id/scores", getCriteriaScores);
router.put("/:id", updateCriteria);
router.delete("/:id", deleteCriteria);

export default router;
