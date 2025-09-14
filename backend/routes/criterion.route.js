import { Router } from "express";
import {
  createCriterion,
  deleteCriterion,
  getCriterionById,
  updateCriterion,
} from "../controllers/criterion.controller.js";

const router = Router();

router.post("/", createCriterion);
router.get("/:id", getCriterionById);
router.put("/:id", updateCriterion);
router.delete("/:id", deleteCriterion);

export default router;
