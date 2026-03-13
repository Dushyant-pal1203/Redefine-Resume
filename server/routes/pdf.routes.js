// server/routes/pdf.routes.js
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

    const resumeJson = resume.toJSON();

    // Increment download count
    await resume.increment("download_count");

    const pdfBuffer = await pdfGenerator.generatePDF(
      resumeJson,
      resumeJson.template || "modern",
    );

    const filename = `${resumeJson.full_name || "resume"}-${resumeJson.template || "modern"}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Generate PDF with provided data (new endpoint)
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

    console.log("📄 Generating PDF with provided data");

    // Generate PDF using the provided resume data
    const pdfBuffer = await pdfGenerator.generatePDF(resumeData, template);

    // Get filename from resume data
    const fullName =
      resumeData.full_name ||
      resumeData.personal?.full_name ||
      resumeData.name ||
      "resume";
    const filename = `${fullName.replace(/\s+/g, "_")}_${template}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Preview PDF in browser (new endpoint)
 */
router.post("/preview", async (req, res) => {
  try {
    const { resumeData, template = "modern" } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    console.log("👁️ Generating PDF preview");

    const pdfBuffer = await pdfGenerator.generatePDF(resumeData, template);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=preview.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Preview Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get list of available templates
 */
router.get("/templates", async (req, res) => {
  try {
    const templates = await pdfGenerator.getTemplatesList();
    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "PDF Generator",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
