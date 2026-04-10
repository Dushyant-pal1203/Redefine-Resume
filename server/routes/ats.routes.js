// routes/ats.routes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Resume } = require("../db/models");
const { analyzeResume } = require("../services/ats.service");
const { NotFoundError, ValidationError } = require("../utils/errors");

/**
 * @route   POST /api/ats/analyze
 * @desc    Analyze a resume and get ATS score
 * @access  Private
 */
router.post("/analyze", async (req, res, next) => {
  try {
    const { resumeData, jobDescription, resumeId } = req.body;

    if (!resumeData) {
      throw new ValidationError("Resume data is required");
    }

    // Try to get user from token if available, but don't require it
    let user = null;
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = decoded;
      }
    } catch (authError) {
      // Auth optional, continuing without user
    }

    // Perform analysis
    const result = await analyzeResume(resumeData, jobDescription);

    // If resumeId is provided and we have a user, save the analysis
    if (resumeId && user) {
      try {
        const resume = await Resume.findOne({
          where: {
            resume_id: resumeId,
            user_id: user.id,
          },
        });

        if (resume) {
          const detectedKeywords =
            result.analysis.keyword_frequency_domain?.detected_patterns || [];
          const missingKeywords =
            result.analysis.keyword_frequency_domain?.missing_patterns || [];

          await resume.update({
            ats_score: result.analysis.quantum_score?.overall || null,
            ats_analysis: result.analysis,
            ats_analyzed_at: new Date(),
            ats_keywords_matched: detectedKeywords,
            ats_keywords_missing: missingKeywords,
          });
        }
      } catch (dbError) {
        // Don't fail the request if saving fails
      }
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/ats/resume/:resumeId
 * @desc    Get ATS analysis for a specific resume
 * @access  Private
 */
router.get("/resume/:resumeId", protect, async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      where: {
        resume_id: resumeId,
        user_id: req.user.id,
      },
      attributes: ["ats_score", "ats_analysis", "ats_analyzed_at"],
    });

    if (!resume) {
      throw new NotFoundError("Resume not found");
    }

    res.json({
      success: true,
      data: {
        ats_score: resume.ats_score,
        ats_analysis: resume.ats_analysis,
        ats_analyzed_at: resume.ats_analyzed_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/ats/resume/:resumeId/analyze
 * @desc    Analyze a specific resume by ID and save results
 * @access  Private
 */
router.post("/resume/:resumeId/analyze", protect, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { jobDescription } = req.body;

    // Find the resume
    const resume = await Resume.findOne({
      where: {
        resume_id: resumeId,
        user_id: req.user.id,
      },
    });

    if (!resume) {
      throw new NotFoundError("Resume not found");
    }

    // Convert resume data to the format expected by analyzer
    const resumeData = {
      personal: {
        full_name: resume.full_name,
        headline: resume.headline,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        website: resume.portfolio_url,
        linkedin: resume.linkedin_url,
        github: resume.github_url,
      },
      summary: {
        summary: resume.professional_summary,
      },
      experience: resume.experience || [],
      education: resume.education || [],
      skills: resume.skills || { technical: [], soft: [], languages: [] },
      projects: resume.projects || [],
      certifications: resume.certifications || [],
      languages: resume.languages || [],
    };

    // Perform analysis
    const result = await analyzeResume(resumeData, jobDescription);

    // Extract keywords for storage
    const detectedKeywords =
      result.analysis.keyword_frequency_domain?.detected_patterns || [];
    const missingKeywords =
      result.analysis.keyword_frequency_domain?.missing_patterns || [];

    // Update resume with ATS data
    await resume.update({
      ats_score: result.analysis.quantum_score?.overall || null,
      ats_analysis: result.analysis,
      ats_analyzed_at: new Date(),
      ats_keywords_matched: detectedKeywords,
      ats_keywords_missing: missingKeywords,
    });

    res.json({
      success: true,
      ...result,
      saved: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/ats/stats
 * @desc    Get ATS statistics for all user resumes
 * @access  Private
 */
router.get("/stats", protect, async (req, res, next) => {
  try {
    const resumes = await Resume.findAll({
      where: {
        user_id: req.user.id,
        ats_score: { [require("sequelize").Op.ne]: null },
      },
      attributes: ["resume_id", "resume_title", "ats_score", "ats_analyzed_at"],
      order: [["ats_score", "DESC"]],
    });

    // Calculate statistics
    const scores = resumes.map((r) => r.ats_score).filter(Boolean);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    res.json({
      success: true,
      data: {
        total_analyzed: resumes.length,
        average_score: avgScore,
        highest_score: highestScore,
        lowest_score: lowestScore,
        resumes: resumes,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
