const PDFParser = require("pdf2json");

async function parsePDF(buffer) {
  return new Promise((resolve, reject) => {
    try {
      console.log("🔍 Starting PDF parsing...");

      const pdfParser = new PDFParser(null, 1);

      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error("❌ PDF parsing error:", errData.parserError);
        reject(
          new Error(
            `PDF parsing failed: ${errData.parserError.message || errData.parserError}`,
          ),
        );
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          console.log("📊 PDF parsed successfully");

          // Extract text from all pages
          let fullText = "";
          const lines = [];

          if (pdfData.Pages && pdfData.Pages.length > 0) {
            pdfData.Pages.forEach((page, pageIndex) => {
              if (page.Texts && page.Texts.length > 0) {
                page.Texts.forEach((text) => {
                  try {
                    const decoded = decodeURIComponent(text.R[0].T || "");
                    fullText += decoded + " ";

                    // Split into lines based on y-position (simplified)
                    if (decoded.trim()) {
                      lines.push(decoded.trim());
                    }
                  } catch (e) {
                    // Skip problematic text
                  }
                });
              }
            });
          }

          console.log(
            `📝 Extracted ${lines.length} lines, total text length: ${fullText.length}`,
          );

          // Clean up text
          fullText = fullText.replace(/\s+/g, " ").trim();

          // Parse the extracted text
          const result = parseResumeData(fullText, lines);

          console.log("✅ PDF parsing completed successfully");
          resolve(result);
        } catch (innerError) {
          console.error("❌ Error processing parsed data:", innerError);
          reject(new Error(`Error processing PDF data: ${innerError.message}`));
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("❌ PDF parsing setup error:", error);
      reject(new Error(`PDF parsing setup failed: ${error.message}`));
    }
  });
}

function parseResumeData(text, lines) {
  // Initialize result object
  const result = {
    full_name: extractName(lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(lines),
    professional_summary: extractSummary(lines),
    experience: extractExperience(lines),
    education: extractEducation(lines),
    skills: extractSkills(lines),
    projects: extractProjects(lines),
    certifications: extractCertifications(lines),
    languages: extractLanguages(lines),
  };

  // Clean up empty arrays
  Object.keys(result).forEach((key) => {
    if (Array.isArray(result[key]) && result[key].length === 0) {
      delete result[key];
    }
  });

  return result;
}

function extractName(lines) {
  // Usually the first non-empty line that's not an email or phone
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line &&
      !line.includes("@") &&
      !/\d{10,}/.test(line) &&
      line.length > 2 &&
      line.length < 50
    ) {
      // Clean up common artifacts
      return line.replace(/[#*_]/g, "").trim();
    }
  }
  return "";
}

function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches && matches.length > 0 ? matches[0].toLowerCase() : "";
}

function extractPhone(text) {
  // Match various phone formats
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches && matches.length > 0 ? matches[0].replace(/[-.\s]/g, "") : "";
}

function extractLocation(lines) {
  const locationKeywords = [
    "city",
    "state",
    "country",
    "india",
    "delhi",
    "mumbai",
    "bangalore",
  ];

  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i].toLowerCase();
    if (locationKeywords.some((keyword) => line.includes(keyword))) {
      return lines[i].trim();
    }
  }
  return "";
}

function extractSummary(lines) {
  let summary = [];
  let inSummary = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (
      line.includes("professional summary") ||
      line.includes("profile") ||
      line.includes("about me")
    ) {
      inSummary = true;
      continue;
    }

    if (inSummary) {
      if (
        line.includes("experience") ||
        line.includes("education") ||
        line.includes("skills")
      ) {
        break;
      }

      if (lines[i].trim().length > 20) {
        summary.push(lines[i].trim());
      }

      if (summary.length >= 3) break;
    }
  }

  return summary.join(" ");
}

function extractExperience(lines) {
  const experiences = [];
  let inExperience = false;
  let currentExp = {};
  let collecting = false;

  const companyKeywords = [
    "technologies",
    "solutions",
    "ltd",
    "inc",
    "pvt",
    "company",
    "studio",
    "hashstudio",
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("work experience") ||
      lowerLine.includes("professional experience") ||
      lowerLine.includes("employment")
    ) {
      inExperience = true;
      continue;
    }

    if (inExperience) {
      if (
        lowerLine.includes("education") ||
        lowerLine.includes("projects") ||
        lowerLine.includes("skills")
      ) {
        if (Object.keys(currentExp).length > 0) {
          experiences.push(currentExp);
        }
        break;
      }

      // Look for company names
      if (
        line.length > 2 &&
        (companyKeywords.some((kw) => lowerLine.includes(kw)) ||
          /[A-Z][a-z]+ (?:Technologies|Solutions|Ltd|Inc|Pvt)/.test(line))
      ) {
        if (Object.keys(currentExp).length > 0) {
          experiences.push(currentExp);
        }

        currentExp = {
          company: line,
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        };
        collecting = true;
      }

      // Look for position/title
      if (
        collecting &&
        currentExp &&
        !currentExp.position &&
        (lowerLine.includes("developer") ||
          lowerLine.includes("engineer") ||
          lowerLine.includes("designer") ||
          lowerLine.includes("manager"))
      ) {
        currentExp.position = line;
      }

      // Look for dates
      if (collecting && currentExp) {
        const dateMatch = line.match(
          /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\s*(?:-|–|to)\s*(?:Present|Current|\w+ \d{4}|\d{4})/i,
        );
        if (dateMatch) {
          const parts = line.split(/-|–|to/).map((s) => s.trim());
          if (parts.length >= 2) {
            currentExp.startDate = parts[0];
            currentExp.endDate = parts[1];
          }
        }
      }

      // Collect description
      if (
        collecting &&
        currentExp &&
        line.length > 20 &&
        !companyKeywords.some((kw) => lowerLine.includes(kw))
      ) {
        if (currentExp.description) {
          currentExp.description += " " + line;
        } else {
          currentExp.description = line;
        }
      }
    }
  }

  // Add last experience
  if (Object.keys(currentExp).length > 0) {
    experiences.push(currentExp);
  }

  return experiences;
}

function extractEducation(lines) {
  const education = [];
  let inEducation = false;
  let currentEdu = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("education") || lowerLine.includes("academic")) {
      inEducation = true;
      continue;
    }

    if (inEducation) {
      if (
        lowerLine.includes("experience") ||
        lowerLine.includes("skills") ||
        lowerLine.includes("projects")
      ) {
        if (Object.keys(currentEdu).length > 0) {
          education.push(currentEdu);
        }
        break;
      }

      // Look for universities/colleges
      if (
        line.includes("University") ||
        line.includes("College") ||
        line.includes("Institute") ||
        line.includes("IGNOU") ||
        line.includes("Delhi") ||
        line.includes("School")
      ) {
        if (Object.keys(currentEdu).length > 0) {
          education.push(currentEdu);
        }

        currentEdu = {
          institution: line,
          degree: "",
          field: "",
          graduationYear: "",
          gpa: "",
        };
      }

      // Look for degree
      if (currentEdu && !currentEdu.degree) {
        if (
          line.includes("MCA") ||
          line.includes("BCA") ||
          line.includes("Bachelor") ||
          line.includes("Master") ||
          line.includes("B.Tech") ||
          line.includes("M.Tech")
        ) {
          currentEdu.degree = line;
        }
      }

      // Look for GPA
      if (
        (currentEdu && line.includes("GPA")) ||
        line.includes("percentage") ||
        line.includes("CGPA")
      ) {
        currentEdu.gpa = line;
      }
    }
  }

  return education;
}

function extractSkills(lines) {
  const skills = [];
  let inSkills = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (
      line.includes("skills") ||
      line.includes("technologies") ||
      line.includes("expertise")
    ) {
      inSkills = true;
      continue;
    }

    if (inSkills) {
      if (
        line.includes("experience") ||
        line.includes("education") ||
        line.includes("projects")
      ) {
        break;
      }

      // Split by common separators
      const lineText = lines[i];
      const skillItems = lineText
        .split(/[,•·|/]/)
        .map((s) => s.trim())
        .filter((s) => s && s.length > 1);

      skillItems.forEach((skill) => {
        // Filter out common non-skill words
        if (
          !skill
            .toLowerCase()
            .match(/^(and|the|with|for|skills?|technologies?)$/)
        ) {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        }
      });
    }
  }

  // Limit to unique skills
  return [...new Set(skills)];
}

function extractProjects(lines) {
  const projects = [];
  let inProjects = false;
  let currentProject = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("projects") || lowerLine.includes("portfolio")) {
      inProjects = true;
      continue;
    }

    if (inProjects) {
      if (
        lowerLine.includes("skills") ||
        lowerLine.includes("education") ||
        lowerLine.includes("experience")
      ) {
        if (Object.keys(currentProject).length > 0) {
          projects.push(currentProject);
        }
        break;
      }

      // Project names are often in uppercase or have specific patterns
      if (line === line.toUpperCase() && line.length > 3 && line.length < 50) {
        if (Object.keys(currentProject).length > 0) {
          projects.push(currentProject);
        }

        currentProject = {
          name: line,
          description: "",
          technologies: "",
          link: "",
        };
      }

      // Collect description
      if (currentProject && line.length > 20) {
        if (currentProject.description) {
          currentProject.description += " " + line;
        } else {
          currentProject.description = line;
        }
      }
    }
  }

  return projects;
}

function extractCertifications(lines) {
  const certifications = [];
  let inCerts = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes("certifications") || line.includes("certificates")) {
      inCerts = true;
      continue;
    }

    if (inCerts) {
      if (line.includes("skills") || line.includes("experience")) {
        break;
      }

      if (lines[i].trim().length > 3) {
        certifications.push(lines[i].trim());
      }
    }
  }

  return certifications;
}

function extractLanguages(lines) {
  const languages = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes("languages") || line.includes("language")) {
      // Look for language entries
      const nextLines = lines.slice(i + 1, i + 5);
      nextLines.forEach((l) => {
        if (
          l.includes("English") ||
          l.includes("Hindi") ||
          l.includes("Spanish") ||
          l.includes("French") ||
          l.includes("German")
        ) {
          languages.push({
            name: l.trim(),
            proficiency: "Professional",
          });
        }
      });
      break;
    }
  }

  return languages;
}

module.exports = { parsePDF };
