import prisma from "../prisma/client.js";

export const createCriteria = async (req, res) => {
  const { name, weight, portionId, description } = req.body;
  try {
    const criteria = await prisma.criteria.create({
      data: { name, weight: parseFloat(weight), portionId, description },
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
  res.json(criteria);
};

export const updateCriteria = async (req, res) => {
  const { id } = req.params;
  const { name, weight, description } = req.body;

  try {
    const criteria = await prisma.criteria.update({
      where: { id: Number(id) },
      data: { name, weight: parseFloat(weight), description },
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
