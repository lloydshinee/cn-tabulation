import prisma from "../prisma/client.js";
import { computeCriteriaScoreForTeam } from "../utils/compute.js";

export const createCriteria = async (req, res) => {
  const { name, weight, portionId } = req.body;
  try {
    const criteria = await prisma.criteria.create({
      data: { name, weight, portionId },
    });
    res.json(criteria);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create criteria" });
  }
};

export const getCriteriaById = async (req, res) => {
  const { id } = req.params;
  const criteria = await prisma.criteria.findMany({
    where: { portionId: Number(id) },
  });
  if (!criteria) return res.status(404).json({ error: "Criteria not found" });
  res.json(criteria);
};

export const updateCriteria = async (req, res) => {
  const { id } = req.params;
  const { name, weight } = req.body;

  try {
    const criteria = await prisma.criteria.update({
      where: { id: Number(id) },
      data: { name, weight },
    });

    res.json(criteria);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update criteria" });
  }
};

export const deleteCriteria = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.criteria.delete({ where: { id: Number(id) } });
    res.json({ message: "Criteria deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete criteria" });
  }
};

export const getCriteriaScores = async (req, res) => {
  const { id } = req.params;

  // Fetch criteria + its criterions + all scores
  const criteria = await prisma.criteria.findUnique({
    where: { id: parseInt(id) },
    include: {
      criterions: { include: { scores: true } },
      portion: true,
    },
  });

  if (!criteria) return res.status(404).json({ error: "Criteria not found" });

  // Get all scores for these criterions
  const allScores = criteria.criterions.flatMap((c) => c.scores);

  // Get unique teamIds & judgeIds
  const teamIds = [...new Set(allScores.map((s) => s.teamId))];
  const judgeIds = [...new Set(allScores.map((s) => s.userId))];

  // Compute totals
  const results = [];
  for (const teamId of teamIds) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });

    const total = computeCriteriaScoreForTeam(
      criteria,
      allScores,
      teamId,
      judgeIds
    );

    results.push({
      teamId,
      teamName: team.name,
      score: total,
    });
  }

  // Sort by score desc
  results.sort((a, b) => b.score - a.score);

  res.json({
    criteriaId: criteria.id,
    criteriaName: criteria.name,
    portion: criteria.portion.name,
    results,
  });
};
