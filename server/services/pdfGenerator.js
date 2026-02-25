const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const templates = require("../templates");
const path = require("path");
const fs = require("fs").promises;

class PDFGenerator {
  constructor() {
    this.registerHelpers();
    this.browser = null;
  }

  registerHelpers() {
    // Helper to check if array has items
    handlebars.registerHelper("hasItems", function (array, options) {
      if (array && Array.isArray(array) && array.length > 0) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // Helper to format date
    handlebars.registerHelper("formatDate", function (date) {
      if (!date) return "Present";
      try {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      } catch {
        return date;
      }
    });

    // Helper for comparisons
    handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });

    // Helper to join array with separator
    handlebars.registerHelper("join", function (arr, separator) {
      if (!arr || !Array.isArray(arr)) return "";
      return arr.join(separator || ", ");
    });

    // Helper to format skills as objects with percentage
    handlebars.registerHelper("formatSkills", function (skills) {
      if (!skills) return [];
      if (Array.isArray(skills)) {
        return skills.map((s) => {
          if (typeof s === "string") {
            return { name: s, level: 80 };
          }
          return s;
        });
      }
      return skills;
    });

    // Helper to check if it's the last item
    handlebars.registerHelper("ifLast", function (index, array, options) {
      if (index === array.length - 1) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // Helper for safe strings
    handlebars.registerHelper("safe", function (text) {
      return new handlebars.SafeString(text);
    });

    // Helper to extract text from HTML
    handlebars.registerHelper("stripHtml", function (html) {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, "");
    });

    // Helper to get nested object property safely
    handlebars.registerHelper("get", function (obj, path) {
      return path
        .split(".")
        .reduce(
          (current, key) =>
            current && current[key] !== undefined ? current[key] : "",
          obj,
        );
    });
  }

  async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
          "--window-size=1200x1600",
        ],
      });
    }
    return this.browser;
  }

  getTemplate(templateName) {
    return templates.getTemplate(templateName);
  }

  prepareDataForTemplate(resumeData) {
    console.log(
      "Preparing data for template:",
      JSON.stringify(resumeData, null, 2),
    );

    let data = { ...resumeData };

    // Handle the flexible format (personal, summary, skills objects)
    const personal = data.personal || {};
    const summary = data.summary || {};
    const skills = data.skills || {};

    // Prepare experience array
    const experience = Array.isArray(data.experience)
      ? data.experience.map((exp) => ({
          title: exp.title || exp.position || "",
          company: exp.company || "",
          location: exp.location || "",
          start_date: exp.start_date || exp.startDate || "",
          end_date: exp.end_date || exp.endDate || "",
          current: exp.current || false,
          description: exp.description || "",
          achievements: exp.achievements || [],
          position: exp.title || exp.position || "",
        }))
      : [];

    // Prepare education array
    const education = Array.isArray(data.education)
      ? data.education.map((edu) => ({
          degree: edu.degree || "",
          institution: edu.institution || edu.school || "",
          location: edu.location || "",
          start_date: edu.start_date || edu.startDate || "",
          end_date: edu.end_date || edu.endDate || "",
          current: edu.current || false,
          grade: edu.grade || "",
          description: edu.description || "",
          school: edu.institution || edu.school || "",
        }))
      : [];

    // Prepare projects array
    const projects = Array.isArray(data.projects)
      ? data.projects.map((proj) => ({
          name: proj.name || "",
          description: proj.description || "",
          technologies: proj.technologies || [],
          url: proj.url || "",
          start_date: proj.start_date || "",
          end_date: proj.end_date || "",
          highlights: proj.highlights || [],
        }))
      : [];

    // Prepare languages
    const languages = Array.isArray(data.languages)
      ? data.languages.map((l) => {
          if (typeof l === "string") {
            return { language: l, proficiency: "Professional" };
          }
          return l;
        })
      : (skills.languages || []).map((l) => {
          if (typeof l === "string") {
            return { language: l, proficiency: "Professional" };
          }
          return l;
        });

    // Prepare certifications
    const certifications = Array.isArray(data.certifications)
      ? data.certifications
      : [];

    // Extract social links with proper field mapping
    const portfolioUrl =
      personal.portfolio_url || personal.portfolio || data.portfolio || "";
    const linkedinUrl =
      personal.linkedin_url || personal.linkedin || data.linkedin || "";
    const githubUrl =
      personal.github_url || personal.github || data.github || "";

    // FIXED: Get display names from personal object
    const portfolioDisplay = personal.portfolio_display || "";
    const linkedinDisplay = personal.linkedin_display || "";
    const githubDisplay = personal.github_display || "";

    // Clean up URLs - remove any leading/trailing spaces
    const cleanPortfolio = portfolioUrl.trim();
    const cleanLinkedin = linkedinUrl.trim();
    const cleanGithub = githubUrl.trim();

    // Prepare the final data object specifically for template
    const preparedData = {
      // Personal Information
      full_name: personal.full_name || data.full_name || "",
      name: personal.full_name || data.full_name || "",
      job_title: personal.job_title || data.job_title || "",
      title: personal.job_title || data.job_title || "",
      headline: personal.headline || data.headline || "",
      email: personal.email || data.email || "",
      phone: personal.phone || data.phone || "",
      location: personal.location || data.location || "",

      // Social Links -
      portfolio_display: portfolioDisplay,
      portfolio_url: cleanPortfolio,

      linkedin_display: linkedinDisplay,
      linkedin_url: cleanLinkedin,

      github_display: githubDisplay,
      github_url: cleanGithub,

      // Also include simple versions for compatibility
      portfolio: cleanPortfolio,
      linkedin: cleanLinkedin,
      github: cleanGithub,

      // Professional Summary
      professional_summary:
        summary.summary || data.professional_summary || data.summary || "",

      // Experience - your template accesses these fields
      experience: experience,

      // Education
      education: education,

      // Skills - your template uses skills.technical and skills.soft
      skills: {
        technical: Array.isArray(skills.technical) ? skills.technical : [],
        soft: Array.isArray(skills.soft) ? skills.soft : [],
        languages: languages,
      },

      // Languages
      languages: languages,

      // Projects
      projects: projects,

      // Other sections
      certifications: certifications,
      publications: Array.isArray(data.publications) ? data.publications : [],
      awards: Array.isArray(data.awards) ? data.awards : [],
      volunteering: Array.isArray(data.volunteering) ? data.volunteering : [],
      interests: Array.isArray(data.interests) ? data.interests : [],

      // Years of experience
      years_of_experience: data.years_of_experience || 0,

      // Template settings
      template: data.template || "modern",
      theme_color: data.theme_color || "#2563eb",
      font_family: data.font_family || "Inter",

      // Metadata
      generatedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    console.log(
      "Prepared data for PDF:",
      JSON.stringify(preparedData, null, 2),
    );
    return preparedData;
  }

  async generatePDF(resumeData, template = "modern", options = {}) {
    let browser = null;
    let page = null;

    try {
      console.log(`📄 Generating PDF with template: ${template}`);

      // Get template HTML
      const templateHtml = this.getTemplate(template);
      if (!templateHtml) {
        throw new Error(`Template '${template}' not found`);
      }

      // Prepare data for template
      const preparedData = this.prepareDataForTemplate(resumeData);

      // Add generation info
      const data = {
        ...preparedData,
        ...options,
      };

      console.log(
        "Final data for PDF generation:",
        JSON.stringify(data, null, 2),
      );

      // Compile template with Handlebars
      const compiledTemplate = handlebars.compile(templateHtml);
      let html = compiledTemplate(data);

      // Add minimal print-specific styles that won't override template styles
      const printStyles = `
        <style>
          /* Only add print-specific styles that don't interfere with template */
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
            }
            
            /* Prevent page breaks inside sections */
            section, .rm-timeline-item, .rm-project-item, .rm-cert-item {
              page-break-inside: avoid;
            }
          }
        </style>
      `;

      // Wrap the template content without adding extra styling
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${printStyles}
          </head>
          <body style="margin: 0; padding: 5px; background: white;">
            ${html}
          </body>
        </html>
      `;

      // Launch browser
      browser = await this.getBrowser();
      page = await browser.newPage();

      // Set viewport to match letter size
      await page.setViewport({
        width: 816,
        height: 1056,
        deviceScaleFactor: 2,
      });

      // Set content
      await page.setContent(html, {
        waitUntil: ["load", "networkidle0"],
        timeout: 30000,
      });

      // Wait for fonts and rendering
      await page.evaluateHandle("document.fonts.ready");
      await page.waitForTimeout(1000);

      // Generate PDF with appropriate margins
      const pdfBuffer = await page.pdf({
        format: "Letter",
        printBackground: true,
        margin: {
          top: "0in",
          bottom: "0in",
          left: "0in",
          right: "0in",
        },
        preferCSSPageSize: true,
      });

      console.log(`✅ PDF generated successfully (${pdfBuffer.length} bytes)`);

      return pdfBuffer;
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  async generateAndSave(resumeData, template = "modern", outputPath) {
    try {
      const pdfBuffer = await this.generatePDF(resumeData, template);
      await fs.writeFile(outputPath, pdfBuffer);
      console.log(`✅ PDF saved to: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error("❌ Error saving PDF:", error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log("🔄 Browser closed");
    }
  }

  async getTemplatesList() {
    return templates.getAllTemplates();
  }
}

// Create singleton instance
const pdfGenerator = new PDFGenerator();

// Cleanup on process exit
process.on("SIGINT", async () => {
  await pdfGenerator.close();
  process.exit();
});

process.on("SIGTERM", async () => {
  await pdfGenerator.close();
  process.exit();
});

// Handle uncaught exceptions
process.on("uncaughtException", async (error) => {
  console.error("❌ Uncaught Exception:", error);
  await pdfGenerator.close();
  process.exit(1);
});

module.exports = pdfGenerator;
