const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { protect } = require("../middleware/auth");
const { User } = require("../db/models");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const sharp = require("sharp");

const uploadDir = path.join(__dirname, "..", "uploads", "avatars");

// Create default avatar if missing
const ensureDefaultAvatar = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const defaultPath = path.join(uploadDir, "default-avatar.png");
    try {
      await fs.access(defaultPath);
    } catch {
      const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#4B5563"/>
        <circle cx="200" cy="160" r="70" fill="#9CA3AF"/>
        <circle cx="200" cy="420" r="130" fill="#9CA3AF"/>
      </svg>`;
      await sharp(Buffer.from(svg)).png().toFile(defaultPath);
      console.log("✅ Default avatar created");
    }
  } catch (error) {
    console.error("❌ Error creating default avatar:", error);
  }
};
ensureDefaultAvatar();

// Multer configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Helper to delete old avatar
const deleteOldAvatar = async (avatarPath) => {
  if (avatarPath && !avatarPath.includes("default-avatar")) {
    try {
      const filename = path.basename(avatarPath);
      const fullPath = path.join(uploadDir, filename);
      await fs.unlink(fullPath);
      console.log("✅ Deleted old avatar:", fullPath);
    } catch (error) {
      console.error("❌ Error deleting avatar:", error);
    }
  }
};

// POST /api/avatar/upload
router.post(
  "/upload",
  protect,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new BadRequestError("Please upload an image file");
      }

      const user = await User.findByPk(req.user.id);
      if (!user) throw new NotFoundError("User");

      const oldAvatar = user.avatar;
      const avatarFilename = req.file.filename;

      // Optimize image
      try {
        const optimizedPath = path.join(
          uploadDir,
          `optimized-${avatarFilename}`,
        );
        await sharp(req.file.path)
          .resize(400, 400, { fit: "cover", withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(optimizedPath);

        await fs.unlink(req.file.path);
        await fs.rename(optimizedPath, req.file.path);
      } catch (error) {
        console.error("Optimization failed, using original:", error);
      }

      // Save only the filename
      user.avatar = avatarFilename;
      await user.save();

      // Delete old avatar
      if (oldAvatar) await deleteOldAvatar(oldAvatar);

      res.json({
        success: true,
        data: { avatar: avatarFilename },
        message: "Avatar uploaded successfully",
      });
    } catch (error) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      next(error);
    }
  },
);

// DELETE /api/avatar
router.delete("/", protect, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new NotFoundError("User");

    if (user.avatar) {
      await deleteOldAvatar(user.avatar);
      user.avatar = null;
      await user.save();
    }

    res.json({ success: true, message: "Avatar deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// GET /api/avatar/:userId - Public route to get avatar
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ["avatar"],
    });
    if (!user || !user.avatar) {
      return res.redirect("/uploads/avatars/default-avatar.png");
    }
    res.redirect(`/uploads/avatars/${user.avatar}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
