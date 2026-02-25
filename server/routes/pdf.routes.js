const express = require("express");
const router = express.Router();
const { Resume } = require("../db/models");
const pdfGenerator = require("../services/pdfGenerator");

/**
 * Generate PDF by Resume ID (existing endpoint)
 */
router.get("/generate/:id", async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { resume_id: req.params.id },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Resume not found",
      });
    }

    const pdfBuffer = await pdfGenerator.generatePDF(
      resume.toJSON(),
      resume.template,
    );

    const filename = `${resume.full_name || "resume"}-${resume.template}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Generate PDF with provided data (new endpoint)
 * This accepts resume data directly in the request body
 */
router.post("/generate-with-data", async (req, res) => {
  try {
    const { resumeData, template = "modern" } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    console.log("Generating PDF with provided data");

    // Generate PDF using the provided resume data
    const pdfBuffer = await pdfGenerator.generatePDF(resumeData, template);

    // Get filename from resume data
    const fullName =
      resumeData.full_name || resumeData.personal?.full_name || "resume";
    const filename = `${fullName}-${template}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
