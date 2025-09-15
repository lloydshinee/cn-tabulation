import {
  computeCriteriaRanking,
  computePortionRanking,
} from "../utils/compute.js";
import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const portionId = parseInt(id);

  const portion = await prisma.portion.findUnique({
    where: { id: portionId },
    include: { criterias: { include: { criterions: true } } },
  });

  const allScores = await prisma.score.findMany();
  const teams = await prisma.team.findMany();
  const judgeIds = [...new Set(allScores.map((s) => s.userId))];

  const portionRanking = computePortionRanking(
    portion,
    allScores,
    teams,
    judgeIds
  );
  const criteriaRanking = computeCriteriaRanking(
    portion,
    allScores,
    teams,
    judgeIds
  );

  res.json({
    portionId,
    portionName: portion.name,
    portionRanking,
    criteriaRanking,
  });
});

export default router;
