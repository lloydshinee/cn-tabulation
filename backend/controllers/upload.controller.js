import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "./uploads"),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

export const uploadMiddleware = multer({ storage, fileFilter }).single("image");

export const uploadImage = async (req, res) => {
  try {
    const { teamId, oldImagePath } = req.body;

    // Delete old image if it exists
    if (oldImagePath) {
      const oldFilePath = path.join(".", oldImagePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("Deleted old image:", oldFilePath);
      }
    }

    // Upload new image
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
