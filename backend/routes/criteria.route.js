import { Router } from "express";
import {
  createCriteria,
  deleteCriteria,
  getCriteriaById,
  updateCriteria,
} from "../controllers/criteria.controller.js";

const router = Router();

router.post("/", createCriteria);
router.get("/:id", getCriteriaById);
router.put("/:id", updateCriteria);
router.delete("/:id", deleteCriteria);

export default router;
