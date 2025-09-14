import prisma from "../prisma/client.js";

export const createTeam = async (req, res) => {
  const { name, description, imageSrc } = req.body;
  try {
    const team = await prisma.team.create({
      data: { name, description, imageSrc },
    });
    res.json(team);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create team" });
  }
};

export const getTeams = async (_req, res) => {
  const teams = await prisma.team.findMany();
  res.json(teams);
};

export const getTeamScores = async (_req, res) => {
  const teams = await prisma.team.findMany({
    include: {
      scores,
    },
  });
  res.json(teams);
};

export const getTeamById = async (req, res) => {
  const { id } = req.params;
  const team = await prisma.team.findUnique({ where: { id: Number(id) } });
  if (!team) return res.status(404).json({ error: "Team not found" });
  res.json(team);
};

export const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, description, imageSrc } = req.body;
  try {
    const team = await prisma.team.update({
      where: { id: Number(id) },
      data: { name, description, imageSrc },
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team" });
  }
};

export const deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id: Number(id) } });
    res.json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team" });
  }
};
