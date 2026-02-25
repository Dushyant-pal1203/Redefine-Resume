const express = require("express");
const router = express.Router();
const { Resume } = require("../db/models");
const { protect } = require("../middleware/auth");
const { validate, resumeValidators } = require("../utils/validators");
const { NotFoundError, AuthorizationError } = require("../utils/errors");

// Apply authentication to all routes
router.use(protect);

// @route   POST /api/resumes
// @desc    Create new resume
// @access  Private
router.post("/", validate(resumeValidators.create), async (req, res, next) => {
  try {
    const resumeData = {
      ...req.body,
      user_id: req.user.id,
    };

    const resume = await Resume.create(resumeData);

    res.status(201).json({
      success: true,
      data: resume,
      message: "Resume created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/resumes
// @desc    Get all resumes for current user
// @access  Private
router.get("/", async (req, res, next) => {
  try {
    const resumes = await Resume.findAll({
      where: { user_id: req.user.id },
      order: [["updated_at", "DESC"]],
      attributes: { exclude: ["parsed_sections", "keywords"] },
    });

    res.json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/resumes/:id
// @desc    Get single resume by ID
// @access  Private
router.get("/:id", validate(resumeValidators.id), async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { resume_id: req.params.id },
    });

    if (!resume) {
      throw new NotFoundError("Resume");
    }

    // Check ownership
    if (resume.user_id !== req.user.id && !resume.is_public) {
      throw new AuthorizationError("Not authorized to view this resume");
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update resume
// @access  Private
router.put(
  "/:id",
  validate(resumeValidators.update),
  async (req, res, next) => {
    try {
      const resume = await Resume.findOne({
        where: { resume_id: req.params.id },
      });

      if (!resume) {
        throw new NotFoundError("Resume");
      }

      // Check ownership
      if (resume.user_id !== req.user.id) {
        throw new AuthorizationError("Not authorized to update this resume");
      }

      // Update with version increment
      const updated = await resume.update({
        ...req.body,
        version: resume.version + 1,
      });

      res.json({
        success: true,
        data: updated,
        message: "Resume updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete("/:id", validate(resumeValidators.id), async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { resume_id: req.params.id },
    });

    if (!resume) {
      throw new NotFoundError("Resume");
    }

    // Check ownership
    if (resume.user_id !== req.user.id) {
      throw new AuthorizationError("Not authorized to delete this resume");
    }

    await resume.destroy();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/resumes/:id/toggle-public
// @desc    Toggle resume public/private
// @access  Private
router.patch(
  "/:id/toggle-public",
  validate(resumeValidators.id),
  async (req, res, next) => {
    try {
      const resume = await Resume.findOne({
        where: { resume_id: req.params.id },
      });

      if (!resume) {
        throw new NotFoundError("Resume");
      }

      // Check ownership
      if (resume.user_id !== req.user.id) {
        throw new AuthorizationError("Not authorized to modify this resume");
      }

      resume.is_public = !resume.is_public;
      await resume.save();

      res.json({
        success: true,
        data: resume,
        message: `Resume is now ${resume.is_public ? "public" : "private"}`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// @route   POST /api/resumes/:id/duplicate
// @desc    Duplicate a resume
// @access  Private
router.post(
  "/:id/duplicate",
  validate(resumeValidators.id),
  async (req, res, next) => {
    try {
      const resume = await Resume.findOne({
        where: { resume_id: req.params.id },
      });

      if (!resume) {
        throw new NotFoundError("Resume");
      }

      // Check ownership
      if (resume.user_id !== req.user.id) {
        throw new AuthorizationError("Not authorized to duplicate this resume");
      }

      // Create duplicate
      const resumeData = resume.toJSON();
      delete resumeData.resume_id;
      delete resumeData.created_at;
      delete resumeData.updated_at;
      delete resumeData.lastGenerated;
      delete resumeData.pdfUrl;

      const duplicate = await Resume.create({
        ...resumeData,
        resume_title: `${resume.resume_title} (Copy)`,
        version: 1,
        is_public: false,
      });

      res.status(201).json({
        success: true,
        data: duplicate,
        message: "Resume duplicated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
