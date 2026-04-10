// server/services/pdfGenerator.js
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

    // Helper for not equal
    handlebars.registerHelper("neq", function (a, b) {
      return a !== b;
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

    // Helper to add index to arrays
    handlebars.registerHelper("withIndex", function (array, options) {
      if (!array || !Array.isArray(array)) return "";
      let result = "";
      for (let i = 0; i < array.length; i++) {
        result += options.fn({
          ...array[i],
          index: i,
          first: i === 0,
          last: i === array.length - 1,
        });
      }
      return result;
    });

    // Helper to check if string contains substring
    handlebars.registerHelper("contains", function (str, substring, options) {
      if (str && str.includes(substring)) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // Helper to truncate text
    handlebars.registerHelper("truncate", function (text, length) {
      if (!text) return "";
      if (text.length <= length) return text;
      return text.substring(0, length) + "...";
    });

    // Helper to calculate years of experience
    handlebars.registerHelper("calculateYears", function (startDate, endDate) {
      if (!startDate) return "";
      const start = new Date(startDate);
      const end =
        endDate && endDate !== "Present" ? new Date(endDate) : new Date();
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return Math.round(years * 10) / 10;
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
      "📊 Preparing data for template:",
      JSON.stringify(resumeData, null, 2).substring(0, 500) + "...",
    );

    let data = { ...resumeData };

    // Handle the flexible format (personal, summary, skills objects)
    const personal = data.personal || {};
    const summary = data.summary || {};
    const skills = data.skills || {};

    // Prepare experience array with all fields
    const experience = Array.isArray(data.experience)
      ? data.experience.map((exp, index) => ({
          id: index,
          title: exp.title || exp.position || "",
          company: exp.company || "",
          location: exp.location || "",
          start_date: exp.start_date || exp.startDate || "",
          end_date: exp.end_date || exp.endDate || "",
          current: exp.current || false,
          description: exp.description || "",
          achievements: Array.isArray(exp.achievements)
            ? exp.achievements
            : exp.highlights
              ? exp.highlights
              : [],
          position: exp.title || exp.position || "",
        }))
      : [];

    // Prepare education array
    const education = Array.isArray(data.education)
      ? data.education.map((edu, index) => ({
          id: index,
          degree: edu.degree || "",
          institution: edu.institution || edu.school || "",
          location: edu.location || "",
          start_date: edu.start_date || edu.startDate || "",
          end_date: edu.end_date || edu.endDate || "",
          current: edu.current || false,
          grade: edu.grade || "",
          description: edu.description || "",
          school: edu.institution || edu.school || "",
          achievements: edu.achievements || [],
        }))
      : [];

    // Prepare projects array
    const projects = Array.isArray(data.projects)
      ? data.projects.map((proj, index) => ({
          id: index,
          name: proj.name || proj.title || "",
          description: proj.description || "",
          technologies: proj.technologies || proj.tech || proj.stack || [],
          url: proj.url || proj.link || "",
          start_date: proj.start_date || proj.startDate || "",
          end_date: proj.end_date || proj.endDate || "",
          current: proj.current || false,
          highlights: proj.highlights || proj.achievements || [],
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
      ? data.certifications.map((cert, index) => ({
          id: index,
          name: cert.name || cert.title || "",
          issuer: cert.issuer || cert.issuing_organization || "",
          date: cert.date || cert.issue_date || "",
          url: cert.url || cert.link || "",
          description: cert.description || "",
        }))
      : [];

    // Prepare awards
    const awards = Array.isArray(data.awards)
      ? data.awards.map((award, index) => ({
          id: index,
          name: award.name || award.title || "",
          description: award.description || "",
          date: award.date || award.year || "",
          issuer: award.issuer || "",
        }))
      : [];

    // Prepare publications
    const publications = Array.isArray(data.publications)
      ? data.publications.map((pub, index) => ({
          id: index,
          title: pub.title || "",
          publisher: pub.publisher || pub.journal || "",
          date: pub.date || pub.published_date || "",
          url: pub.url || pub.link || "",
          description: pub.description || pub.abstract || "",
        }))
      : [];

    // Prepare volunteering
    const volunteering = Array.isArray(data.volunteering)
      ? data.volunteering.map((vol, index) => ({
          id: index,
          organization: vol.organization || vol.org || "",
          role: vol.role || vol.position || "",
          start_date: vol.start_date || vol.startDate || "",
          end_date: vol.end_date || vol.endDate || "",
          current: vol.current || false,
          description: vol.description || "",
          achievements: vol.achievements || [],
        }))
      : [];

    // Prepare interests
    const interests = Array.isArray(data.interests)
      ? data.interests.map((i) =>
          typeof i === "string" ? i : i.name || i.interest || "",
        )
      : [];

    // Extract social links with proper field mapping
    const portfolioUrl =
      personal.portfolio_url || personal.portfolio || data.portfolio || "";
    const linkedinUrl =
      personal.linkedin_url || personal.linkedin || data.linkedin || "";
    const githubUrl =
      personal.github_url || personal.github || data.github || "";

    // Get display names
    const portfolioDisplay =
      personal.portfolio_display ||
      portfolioUrl.replace(/^https?:\/\//, "").split("/")[0] ||
      "portfolio";
    const linkedinDisplay =
      personal.linkedin_display ||
      "linkedin.com/in/" + (personal.linkedin_username || "");
    const githubDisplay =
      personal.github_display ||
      "github.com/" + (personal.github_username || "");

    // Clean up URLs
    const cleanPortfolio = portfolioUrl.trim();
    const cleanLinkedin = linkedinUrl.trim();
    const cleanGithub = githubUrl.trim();

    // Calculate total years of experience if not provided
    let yearsOfExperience = data.years_of_experience || 0;
    if (!yearsOfExperience && experience.length > 0) {
      const dates = experience
        .map((exp) => {
          const start = exp.start_date ? new Date(exp.start_date) : null;
          const end = exp.current
            ? new Date()
            : exp.end_date
              ? new Date(exp.end_date)
              : null;
          return { start, end };
        })
        .filter((d) => d.start);

      if (dates.length > 0) {
        const totalMonths = dates.reduce((acc, d) => {
          const end = d.end || new Date();
          const months = (end - d.start) / (1000 * 60 * 60 * 24 * 30.44);
          return acc + months;
        }, 0);
        yearsOfExperience = Math.round((totalMonths / 12) * 10) / 10;
      }
    }

    // Prepare the final data object
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

      // Social Links
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

      // Experience
      experience: experience,

      // Education
      education: education,

      // Skills
      skills: {
        technical: Array.isArray(skills.technical) ? skills.technical : [],
        soft: Array.isArray(skills.soft) ? skills.soft : [],
        languages: skills.languages || [],
      },
      technical_skills: Array.isArray(skills.technical) ? skills.technical : [],
      soft_skills: Array.isArray(skills.soft) ? skills.soft : [],
      programming_languages: skills.languages || [],

      // Languages
      languages: languages,

      // Projects
      projects: projects,

      // Other sections
      certifications: certifications,
      publications: publications,
      awards: awards,
      volunteering: volunteering,
      interests: interests,

      // Years of experience
      years_of_experience: yearsOfExperience,

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

    console.log("✅ Data prepared successfully");
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

      // Compile template with Handlebars
      const compiledTemplate = handlebars.compile(templateHtml);
      let html = compiledTemplate(data);

      // Add print-specific styles that won't override template styles
      const printStyles = `
        <style>
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Prevent page breaks inside sections */
            .rm-timeline-item, 
            .rm-project-item, 
            .rm-cert-item,
            .rm-award-item,
            .rm-volunteer-item,
            .rm-publication-item,
            .rc-card,
            .rp-experience-item,
            .rm-item {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Keep headers with content */
            .rm-section-title,
            .rp-section-title,
            .rc-section-title {
              page-break-after: avoid;
              break-after: avoid;
            }
            
            /* Avoid page breaks right after headers */
            h1, h2, h3, h4 {
              page-break-after: avoid;
              break-after: avoid;
            }
            
            /* Ensure tables don't break weirdly */
            table {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Links don't need to show URL in print */
            a {
              text-decoration: none;
            }
            
            /* Ensure background colors print */
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          /* Ensure fonts load properly */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        </style>
      `;

      // Wrap the template content
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            ${printStyles}
          </head>
          <body style="margin: 0; padding: 0; background: white; font-family: 'Inter', sans-serif;">
            ${html}
          </body>
        </html>
      `;

      // Launch browser
      browser = await this.getBrowser();
      page = await browser.newPage();

      // Set viewport
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2,
      });

      // Set content with longer timeout
      await page.setContent(html, {
        waitUntil: ["load", "networkidle0"],
        timeout: 60000,
      });

      // Wait for fonts and rendering
      await page.evaluateHandle("document.fonts.ready");
      await page.waitForTimeout(2000);

      // Generate PDF with proper margins
      const pdfBuffer = await page.pdf({
        format: "Letter",
        printBackground: true,
        margin: {
          top: "0.1in",
          bottom: "0.1in",
          left: "0.1in",
          right: "0.1in",
        },
        preferCSSPageSize: true,
      });

      console.log(
        `✅ PDF generated successfully (${(pdfBuffer.length / 1024).toFixed(2)} KB)`,
      );

      return pdfBuffer;
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
      // Don't close browser here, keep it for reuse
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
