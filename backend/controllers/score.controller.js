import prisma from "../prisma/client.js";

// POST /scores
export const insertScore = async (req, res) => {
  const { value, criterionId, userId, teamId } = req.body;

  try {
    const score = await prisma.score.create({
      data: {
        value,
        criterionId: parseInt(criterionId),
        userId: parseInt(userId),
        teamId: parseInt(teamId),
      },
    });

    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert score" });
  }
};

// Get scores (optionally filter by teamId and/or criterionId)
export const getScore = async (req, res) => {
  try {
    const { teamId, criterionId, userId } = req.query;

    const scores = await prisma.score.findFirst({
      where: {
        ...(teamId && { teamId: parseInt(teamId) }),
        ...(criterionId && { criterionId: parseInt(criterionId) }),
        ...(userId && { userId: parseInt(userId) }),
      },
    });
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
};

// Get a single score by ID
export const getScoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const score = await prisma.score.findFirst({
      where: { criterionId: Number(id) },
    });
    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch score" });
  }
};

// Update a score
export const updateScore = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  try {
    const score = await prisma.score.update({
      where: { id: Number(id) },
      data: { value },
    });
    res.json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update score" });
  }
};

// Delete a score
export const deleteScore = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.score.delete({ where: { id: Number(id) } });
    res.json({ message: "Score deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete score" });
  }
};
