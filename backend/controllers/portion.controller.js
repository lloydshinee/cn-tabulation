import prisma from "../prisma/client.js";
import { computePortionScore } from "../utils/compute.js";

export const createPortion = async (req, res) => {
  const { name, description } = req.body;
  try {
    const portion = await prisma.portion.create({
      data: { name, description },
    });
    res.json(portion);
  } catch (error) {
    res.status(500).json({ error: "Failed to create portion" });
  }
};

export const getPortions = async (_req, res) => {
  const portions = await prisma.portion.findMany();
  res.json(portions);
};

export const getPortionScores = async (req, res) => {
  try {
    const { id, judgeId } = req.params;
    const portionId = parseInt(id);
    const judgeIdInt = parseInt(judgeId);

    const portion = await prisma.portion.findUnique({
      where: { id: portionId },
      include: {
        criterias: { include: { criterions: { include: { scores: true } } } },
      },
    });

    if (!portion) return res.status(404).json({ error: "Portion not found" });

    const teams = await prisma.team.findMany();
    const allScores = await prisma.score.findMany({
      where: { userId: judgeIdInt },
    });

    const results = teams.map((team) => {
      const { portionSubtotal, criteriaBreakdown } = computePortionScore(
        portion,
        allScores,
        team.id,
        judgeIdInt
      );
      return {
        teamId: team.id,
        teamName: team.name,
        portionId: portion.id,
        portionName: portion.name,
        subtotal: portionSubtotal,
        criteriaBreakdown,
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllPortionScores = async (req, res) => {
  const portions = await prisma.portion.findMany({
    include: {
      criterias: { include: { criterions: { include: { scores: true } } } },
    },
  });
  const allScores = await prisma.score.findMany();
  const judgeIds = [...new Set(allScores.map((s) => s.userId))];
  const teams = await prisma.team.findMany();

  const results = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    totals: getTeamTotals(portions, allScores, team.id, judgeIds),
  }));

  res.json(results);
};

export const getPortionById = async (req, res) => {
  const { id } = req.params;

  const portion = await prisma.portion.findUnique({
    where: { id: parseInt(id) },
  });
  if (!portion) return res.status(404).json({ error: "Portion not found" });
  res.json(portion);
};

export const updatePortion = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const portion = await prisma.portion.update({
      where: { id: Number(id) },
      data: { name, description },
    });
    res.json(portion);
  } catch (error) {
    res.status(500).json({ error: "Failed to update portion" });
  }
};

export const deletePortion = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.portion.delete({ where: { id: Number(id) } });
    res.json({ message: "Portion deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete portion" });
  }
};
