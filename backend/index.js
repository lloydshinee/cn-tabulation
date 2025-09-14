import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import judgeRoutes from "./routes/judge.route.js";
import teamRoutes from "./routes/team.route.js";
import portionRoutes from "./routes/portion.route.js";
import criterionRoutes from "./routes/criterion.route.js";
import criteriaRoutes from "./routes/criteria.route.js";
import scoreRoutes from "./routes/score.route.js";
import uploadRoutes from "./routes/upload.route.js";
import rankingRoutes from "./routes/ranking.route.js";
import prisma from "./prisma/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/judges", judgeRoutes);
app.use("/teams", teamRoutes);
app.use("/portions", portionRoutes);
app.use("/criterion", criterionRoutes);
app.use("/criteria", criteriaRoutes);
app.use("/scores", scoreRoutes);
app.use("/ranking", rankingRoutes);

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

prisma.score.deleteMany();

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running at ${PORT}`));
