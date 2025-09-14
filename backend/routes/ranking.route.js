import { getLeaderboard } from "../utils/compute.js";
import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

export const getRanking = async (req, res) => {
  const portions = await prisma.portion.findMany({
    include: {
      criterias: { include: { criterions: { include: { scores: true } } } },
    },
  });
  const allScores = await prisma.score.findMany();
  const judgeIds = [...new Set(allScores.map((s) => s.userId))];
  const teams = await prisma.team.findMany();

  const leaderboard = getLeaderboard(portions, allScores, teams, judgeIds);
  res.json(leaderboard);
};

router.get("/", getRanking);

export default router;
