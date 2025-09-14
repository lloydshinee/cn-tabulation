import prisma from "../prisma/client.js";
import { getTeamTotals, round2 } from "../utils/compute.js";

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
  const { id } = req.params;
  const portion = await prisma.portion.findUnique({
    where: { id: parseInt(id) },
    include: {
      criterias: {
        include: {
          criterions: {
            include: { scores: true },
          },
        },
      },
    },
  });

  const allScores = await prisma.score.findMany();
  const judgeIds = [...new Set(allScores.map((s) => s.userId))];
  const teams = await prisma.team.findMany();

  const results = teams.map((team) => {
    // average score across judges (rounded)
    const avgScore = round2(
      getTeamTotals([portion], allScores, team.id, judgeIds)[portion.id]
    );

    // per-judge breakdown
    const judgeScores = judgeIds.map((judgeId) => {
      let portionSubtotal = 0;

      const criteriasBreakdown = portion.criterias.map((criteria) => {
        let criteriaSubtotal = 0;

        const rawScores = criteria.criterions.map((criterion) => {
          const score = allScores.find(
            (s) =>
              s.criterionId === criterion.id &&
              s.teamId === team.id &&
              s.userId === judgeId
          );

          const rawValue = score ? score.value : 0;
          const weighted = rawValue * (criterion.weight / 100);
          criteriaSubtotal += weighted;

          return {
            criterionId: criterion.id,
            description: criterion.description,
            weight: criterion.weight,
            rawValue: round2(rawValue),
            weighted: round2(weighted),
          };
        });

        // apply criteria weight
        const criteriaWeighted = criteriaSubtotal * (criteria.weight / 100);
        portionSubtotal += criteriaWeighted;

        return {
          criteriaId: criteria.id,
          name: criteria.name,
          subtotal: round2(criteriaSubtotal), // subtotal before criteria weight
          weighted: round2(criteriaWeighted), // after applying criteria weight
          rawScores,
        };
      });

      return {
        judgeId,
        criterias: criteriasBreakdown,
        portionSubtotal: round2(portionSubtotal),
      };
    });

    return {
      teamId: team.id,
      teamName: team.name,
      avgScore,
      judgeScores,
    };
  });

  res.json(results);
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
