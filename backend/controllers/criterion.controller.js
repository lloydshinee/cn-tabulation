import prisma from "../prisma/client.js";

// Create a criterion
export const createCriterion = async (req, res) => {
  const { description, weight, criteriaId, name } = req.body;
  try {
    const criterion = await prisma.criterion.create({
      data: {
        name,
        description,
        weight: parseFloat(weight),
        criteriaId,
      },
    });
    res.json(criterion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create criterion" });
  }
};

// Get criterion by Criteria ID
export const getCriterionById = async (req, res) => {
  const { id } = req.params;
  try {
    const criterion = await prisma.criterion.findMany({
      where: { criteriaId: Number(id) },
    });
    if (!criterion)
      return res.status(404).json({ error: "Criterion not found" });
    res.json(criterion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch criterion" });
  }
};

// Update a criterion
export const updateCriterion = async (req, res) => {
  const { id } = req.params;
  const { description, weight, name } = req.body;
  try {
    const criterion = await prisma.criterion.update({
      where: { id: Number(id) },
      data: { description, weight: parseFloat(weight), name },
    });
    res.json(criterion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update criterion" });
  }
};

// Delete a criterion
export const deleteCriterion = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.criterion.delete({ where: { id: Number(id) } });
    res.json({ message: "Criterion deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete criterion" });
  }
};
