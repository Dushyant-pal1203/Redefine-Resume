const express = require("express");
const router = express.Router();
const templates = require("../templates");
const { protect } = require("../middleware/auth");
const { validate, templateValidators } = require("../utils/validators");

router.get("/", (req, res) => {
  try {
    const templateList = templates.getAllTemplates();

    res.json({
      success: true,
      count: templateList.length,
      data: templateList,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch templates",
    });
  }
});

router.get("/:id", validate(templateValidators.id), (req, res) => {
  try {
    const { id } = req.params;
    const templateHtml = templates.getTemplate(id);
    const metadata = templates.getTemplateMetadata(id);

    if (!templateHtml) {
      return res.status(404).json({
        success: false,
        error: "Template not found",
      });
    }

    res.json({
      success: true,
      data: {
        id,
        html: templateHtml,
        metadata,
      },
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch template",
    });
  }
});

router.get("/:id/preview", validate(templateValidators.id), (req, res) => {
  try {
    const { id } = req.params;
    const templateHtml = templates.getTemplate(id);

    if (!templateHtml) {
      return res.status(404).send("Template not found");
    }

    res.setHeader("Content-Type", "text/html");
    res.send(templateHtml);
  } catch (error) {
    console.error("Error rendering template preview:", error);
    res.status(500).send("Error rendering template");
  }
});

router.post(
  "/:id/render",
  protect,
  validate(templateValidators.id),
  (req, res) => {
    try {
      const { id } = req.params;
      const resumeData = req.body;

      const templateHtml = templates.getTemplate(id);

      if (!templateHtml) {
        return res.status(404).json({
          success: false,
          error: "Template not found",
        });
      }

      res.json({
        success: true,
        html: templateHtml,
      });
    } catch (error) {
      console.error("Error rendering template:", error);
      res.status(500).json({
        success: false,
        error: "Failed to render template",
      });
    }
  },
);

module.exports = router;
