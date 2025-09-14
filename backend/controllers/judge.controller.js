import prisma from "../prisma/client.js";
import { Role } from "../generated/prisma/client.js";

export const createJudge = async (req, res) => {
  const { fullName, username, password, imageSrc } = req.body;
  try {
    const judge = await prisma.user.create({
      data: { fullName, username, password, role: Role.JUDGE, imageSrc },
    });
    res.json(judge);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create judge" });
  }
};

export const getJudges = async (_req, res) => {
  const judges = await prisma.user.findMany({ where: { role: Role.JUDGE } });
  res.json(judges);
};

export const getJudgeById = async (req, res) => {
  const { id } = req.params;
  const judge = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!judge || judge.role !== Role.JUDGE) {
    return res.status(404).json({ error: "Judge not found" });
  }
  res.json(judge);
};

export const updateJudge = async (req, res) => {
  const { id } = req.params;
  const { fullName, username, password, imageSrc } = req.body;
  try {
    const judge = await prisma.user.update({
      where: { id: Number(id) },
      data: { fullName, username, password, imageSrc },
    });
    res.json(judge);
  } catch (error) {
    res.status(500).json({ error: "Failed to update judge" });
  }
};

export const deleteJudge = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Judge deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete judge" });
  }
};
