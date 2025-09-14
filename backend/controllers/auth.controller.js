import prisma from "../prisma/client.js";

export const login = async (req, res) => {
  
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      imageSrc: user.imageSrc,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};
