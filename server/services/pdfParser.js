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

          // Extract and aggressively clean the text
          const extractedData = extractAndCleanText(pdfData);

          // Parse the cleaned data
          const result = parseResumeData(extractedData);

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

function extractAndCleanText(pdfData) {
  let fullText = "";
  const lines = [];
  const rawTexts = [];

  if (pdfData.Pages && pdfData.Pages.length > 0) {
    pdfData.Pages.forEach((page) => {
      if (page.Texts && page.Texts.length > 0) {
        // Sort by y-position to maintain reading order
        const sortedTexts = [...page.Texts].sort((a, b) => {
          const y1 = a.y || 0;
          const y2 = b.y || 0;
          return y1 - y2;
        });

        sortedTexts.forEach((text) => {
          try {
            const decoded = decodeURIComponent(text.R[0].T || "");
            if (decoded.trim()) {
              rawTexts.push(decoded);
              fullText += decoded + " ";
            }
          } catch (e) {
            // Skip problematic text
          }
        });
      }
    });
  }

  // Join all raw text
  const rawJoined = rawTexts.join(" ");

  // AGGRESSIVE CLEANING

  // Step 1: Fix spaced out letters (like "D U S H Y A N T" -> "DUSHYANT")
  let cleaned = rawJoined.replace(/([A-Z])\s+(?=[A-Z])/g, "$1");
  cleaned = cleaned.replace(/([a-z])\s+(?=[a-z])/g, "$1");

  // Step 2: Fix spaced out numbers (like "9 7 1 6" -> "9716")
  cleaned = cleaned.replace(/(\d)\s+(\d)/g, "$1$2");

  // Step 3: Fix email addresses (like "ADITYA . PAL 32742 @ GMAIL . COM" -> "ADITYA.PAL32742@GMAIL.COM")
  cleaned = cleaned.replace(/([A-Z0-9])\s+\.\s+([A-Z0-9])/g, "$1.$2");
  cleaned = cleaned.replace(/([a-zA-Z0-9])\s+@\s+([a-zA-Z])/g, "$1@$2");
  cleaned = cleaned.replace(/@\s+([a-zA-Z])/g, "@$1");
  cleaned = cleaned.replace(/([a-zA-Z])\s+\.\s+([a-zA-Z])/g, "$1.$2");

  // Step 4: Fix URLs
  cleaned = cleaned.replace(/https?\s*:\s*\/\s*\/\s*/g, "https://");
  cleaned = cleaned.replace(/\/\s+/g, "/");

  // Step 5: Fix common patterns in your specific PDF
  cleaned = cleaned.replace(/F ull S tack/g, "Full Stack");
  cleaned = cleaned.replace(/W eb/g, "Web");
  cleaned = cleaned.replace(/D eveloper/g, "Developer");
  cleaned = cleaned.replace(/P rofessional/g, "Professional");
  cleaned = cleaned.replace(/S ummary/g, "Summary");
  cleaned = cleaned.replace(/P ortfolio/g, "Portfolio");
  cleaned = cleaned.replace(/I ndia/g, "India");
  cleaned = cleaned.replace(/D elhi/g, "Delhi");

  // Step 6: Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Step 7: Split into lines based on common sentence endings
  const lineBreaks = cleaned.split(/(?<=[.!?])\s+(?=[A-Z])/);

  lineBreaks.forEach((line) => {
    if (line.trim()) {
      lines.push(line.trim());
    }
  });

  return {
    fullText: cleaned,
    lines: lines,
    rawTexts: rawTexts,
  };
}

function parseResumeData(extractedData) {
  const { fullText, lines } = extractedData;

  // Log for debugging
  console.log("Cleaned fullText:", fullText.substring(0, 200) + "...");
  console.log("First 10 lines:", lines.slice(0, 10));

  // Extract all fields with specific patterns
  const fullName = extractName(fullText, lines);
  const email = extractEmail(fullText);
  const phone = extractPhone(fullText);
  const location = extractLocation(fullText, lines);
  const jobTitle = extractJobTitle(fullText, lines);
  const summary = extractSummary(fullText, lines);
  const skills = extractSkills(fullText, lines);
  const experience = extractExperience(fullText, lines);
  const education = extractEducation(fullText, lines);
  const projects = extractProjects(fullText, lines);
  const certifications = extractCertifications(fullText, lines);
  const languages = extractLanguages(fullText, lines);
  const portfolioUrl = extractPortfolioUrl(fullText);
  const linkedinUrl = extractLinkedInUrl(fullText);
  const githubUrl = extractGitHubUrl(fullText);

  console.log("Extracted:", { fullName, email, phone, location, jobTitle });

  return {
    full_name: fullName,
    job_title: jobTitle,
    headline: jobTitle, // Use job title as headline
    email: email,
    phone: phone,
    location: location,
    professional_summary: summary,
    portfolio_url: portfolioUrl,
    linkedin_url: linkedinUrl,
    github_url: githubUrl,
    twitter_url: "",
    links: [],
    experience: experience,
    education: education,
    projects: projects,
    skills: skills,
    certifications: certifications,
    achievements: [],
    languages: languages,
    keywords: [],
    parsed_sections: {},
    years_of_experience: calculateYearsOfExperience(experience),
    template: "modern",
    theme_color: "#2563eb",
    font_family: "Inter",
    layout: "single-column",
    is_public: false,
    version: 1,
    lastGenerated: null,
    pdfUrl: null,
    portfolio_display: fullName
      ? `${fullName.split(" ")[0]}'s Portfolio`
      : "Portfolio",
    linkedin_display: linkedinUrl ? "LinkedIn" : null,
    github_display: githubUrl ? "GitHub" : null,
  };
}

function extractName(fullText, lines) {
  // Look for patterns like "DUSHYANT PAL" (all caps, two words)
  const namePatterns = [
    /^([A-Z][A-Z\s]+[A-Z])(?:\s|$)/m, // All caps name
    /([A-Z][a-z]+ [A-Z][a-z]+)/, // Proper case
    /([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)/, // With middle initial
  ];

  for (const pattern of namePatterns) {
    const match = fullText.match(pattern);
    if (match) {
      const name = match[1].trim();
      if (name.length > 3 && name.length < 40 && !name.includes("@")) {
        return name;
      }
    }
  }

  // Try first line if it looks like a name
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (
      firstLine.length > 3 &&
      firstLine.length < 40 &&
      !firstLine.includes("@") &&
      !firstLine.includes("http") &&
      firstLine.split(" ").length <= 3
    ) {
      return firstLine;
    }
  }

  return "";
}

function extractEmail(fullText) {
  // Clean the text first - remove spaces around @ and .
  const cleanedForEmail = fullText
    .replace(/\s+@\s+/g, "@")
    .replace(/\s+\.\s+/g, ".")
    .replace(/([a-zA-Z0-9])\s+([a-zA-Z0-9])/g, "$1$2");

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = cleanedForEmail.match(emailRegex);

  if (matches && matches.length > 0) {
    return matches[0].toLowerCase();
  }

  return "";
}

function extractPhone(fullText) {
  // Remove all spaces from text first
  const noSpaces = fullText.replace(/\s+/g, "");

  // Look for 10-digit number
  const phoneRegex = /(\+?\d{1,3})?(\d{10})/;
  const match = noSpaces.match(phoneRegex);

  if (match) {
    // Return the 10-digit part
    return match[2];
  }

  // Try with original text
  const originalPhoneRegex =
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const originalMatch = fullText.match(originalPhoneRegex);

  if (originalMatch) {
    return originalMatch[0].replace(/[-.\s]/g, "");
  }

  return "";
}

function extractLocation(fullText, lines) {
  // Look for "DELHI, INDIA" pattern
  const locationPattern = /([A-Z\s]+,\s*[A-Z\s]+)/;
  const match = fullText.match(locationPattern);

  if (match) {
    return match[1].trim();
  }

  // Look for city names
  const cities = [
    "DELHI",
    "MUMBAI",
    "BANGALORE",
    "INDIA",
    "NEW YORK",
    "LONDON",
  ];
  for (const city of cities) {
    if (fullText.includes(city)) {
      // Find the full location text
      const locationRegex = new RegExp(`([A-Z\\s,]+${city}[A-Z\\s,]*)`);
      const cityMatch = fullText.match(locationRegex);
      if (cityMatch) {
        return cityMatch[1].trim();
      }
    }
  }

  return "";
}

function extractJobTitle(fullText, lines) {
  const titlePatterns = [
    /(Full Stack Web Developer|Frontend Developer|Backend Developer|Software Engineer|Web Developer)/i,
    /(Developer|Engineer|Designer|Architect)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = fullText.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return "";
}

function extractSummary(fullText, lines) {
  // Find the Professional Summary section
  let summaryText = "";
  let inSummary = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      line.includes("Professional Summary") ||
      line.includes("PROFESSIONAL SUMMARY")
    ) {
      inSummary = true;
      continue;
    }

    if (inSummary) {
      if (
        line.includes("Skills") ||
        line.includes("SKILLS") ||
        line.includes("Experience") ||
        line.includes("EXPERIENCE")
      ) {
        break;
      }

      if (line.length > 20) {
        summaryText += line + " ";
      }
    }
  }

  return summaryText.trim() || "";
}

function extractSkills(fullText, lines) {
  const skills = new Set();

  // Common tech skills
  const techSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Git",
    "Next.js",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "TypeScript",
    "Angular",
    "Vue.js",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GraphQL",
    "REST API",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Firebase",
    "Tailwind",
    "Bootstrap",
  ];

  // Check each line for skills
  lines.forEach((line) => {
    techSkills.forEach((skill) => {
      if (line.toLowerCase().includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    });

    // Also check comma-separated lists
    if (line.includes(",")) {
      const parts = line.split(",");
      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.length > 1 && trimmed.length < 30) {
          techSkills.forEach((skill) => {
            if (trimmed.toLowerCase().includes(skill.toLowerCase())) {
              skills.add(skill);
            }
          });
        }
      });
    }
  });

  return Array.from(skills);
}

function extractExperience(fullText, lines) {
  const experiences = [];
  let currentExp = null;
  let inExperience = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("work experience") ||
      lowerLine.includes("experience")
    ) {
      inExperience = true;
      continue;
    }

    if (!inExperience) continue;

    if (
      lowerLine.includes("projects") ||
      lowerLine.includes("education") ||
      lowerLine.includes("skills")
    ) {
      if (currentExp) {
        experiences.push(currentExp);
      }
      break;
    }

    // Look for company names
    if (
      line.includes("Technologies") ||
      line.includes("Solutions") ||
      line.includes("Pvt. Ltd") ||
      line.includes("Inc")
    ) {
      if (currentExp) {
        experiences.push(currentExp);
      }

      currentExp = {
        title: "",
        company: line,
        location: "",
        start_date: "",
        end_date: "",
        current: false,
        description: "",
        achievements: [],
      };
      continue;
    }

    if (!currentExp) continue;

    // Look for job title
    if (
      !currentExp.title &&
      (lowerLine.includes("developer") ||
        lowerLine.includes("engineer") ||
        lowerLine.includes("assistant"))
    ) {
      currentExp.title = line;
      continue;
    }

    // Look for dates
    const dateMatch = line.match(
      /(\d{2}\/\d{4}|\d{4})\s*(?:-|–|to)\s*(\d{2}\/\d{4}|\d{4}|present|current)/i,
    );
    if (dateMatch) {
      currentExp.start_date = dateMatch[1];
      currentExp.end_date = dateMatch[2].toLowerCase().includes("present")
        ? ""
        : dateMatch[2];
      currentExp.current = dateMatch[2].toLowerCase().includes("present");
      continue;
    }

    // Add to description
    if (line.length > 15 && !line.includes("@") && !line.includes("http")) {
      if (currentExp.description) {
        currentExp.description += " " + line;
      } else {
        currentExp.description = line;
      }
    }
  }

  return experiences;
}

function extractEducation(fullText, lines) {
  const education = [];
  let currentEdu = null;
  let inEducation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("education") || lowerLine.includes("EDUCATION")) {
      inEducation = true;
      continue;
    }

    if (!inEducation) continue;

    if (
      lowerLine.includes("projects") ||
      lowerLine.includes("skills") ||
      lowerLine.includes("experience")
    ) {
      if (currentEdu) {
        education.push(currentEdu);
      }
      break;
    }

    // Look for institutions
    if (
      line.includes("University") ||
      line.includes("College") ||
      line.includes("Institute") ||
      line.includes("IGNOU")
    ) {
      if (currentEdu) {
        education.push(currentEdu);
      }

      currentEdu = {
        degree: "",
        institution: line,
        location: "",
        start_date: "",
        end_date: "",
        current: false,
        grade: "",
        description: "",
      };
      continue;
    }

    if (!currentEdu) continue;

    // Look for degree
    if (
      !currentEdu.degree &&
      (lowerLine.includes("mca") ||
        lowerLine.includes("bca") ||
        lowerLine.includes("bachelor") ||
        lowerLine.includes("master"))
    ) {
      currentEdu.degree = line;
      continue;
    }

    // Look for GPA
    if (lowerLine.includes("gpa") || lowerLine.includes("cgpa")) {
      currentEdu.grade = line;
    }
  }

  return education;
}

function extractProjects(fullText, lines) {
  const projects = [];
  let currentProject = null;
  let inProjects = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("projects") || lowerLine.includes("PROJECTS")) {
      inProjects = true;
      continue;
    }

    if (!inProjects) continue;

    if (
      lowerLine.includes("education") ||
      lowerLine.includes("skills") ||
      lowerLine.includes("experience")
    ) {
      if (currentProject) {
        projects.push(currentProject);
      }
      break;
    }

    // Project names are often in all caps
    if (line === line.toUpperCase() && line.length > 4 && line.length < 40) {
      if (currentProject) {
        projects.push(currentProject);
      }

      currentProject = {
        name: line,
        description: "",
        technologies: [],
        url: "",
        start_date: "",
        end_date: "",
        current: false,
        highlights: [],
      };
      continue;
    }

    if (!currentProject) continue;

    // Add to description
    if (line.length > 20 && !line.includes("http")) {
      if (currentProject.description) {
        currentProject.description += " " + line;
      } else {
        currentProject.description = line;
      }
    }
  }

  return projects;
}

function extractCertifications(fullText, lines) {
  const certifications = [];
  let inCerts = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("certifications") ||
      lowerLine.includes("CERTIFICATIONS")
    ) {
      inCerts = true;
      continue;
    }

    if (!inCerts) continue;

    if (
      lowerLine.includes("skills") ||
      lowerLine.includes("experience") ||
      lowerLine.includes("projects")
    ) {
      break;
    }

    if (line.length > 5 && line.length < 100 && !line.includes("@")) {
      certifications.push(line);
    }
  }

  return certifications;
}

function extractLanguages(fullText, lines) {
  const languages = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes("languages") || line.includes("LANGUAGES")) {
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const langLine = lines[j];
        if (
          langLine.match(
            /(English|Hindi|Spanish|French|German|Chinese|Japanese)/i,
          )
        ) {
          languages.push(langLine);
        }
      }
      break;
    }
  }

  return languages;
}

function extractPortfolioUrl(fullText) {
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|io|dev|app|me|net|org)(?:\/[^\s]*)?/gi;
  const matches = fullText.match(urlPattern);

  if (matches) {
    const portfolio = matches.find(
      (url) =>
        !url.includes("linkedin") &&
        !url.includes("github") &&
        !url.includes("twitter"),
    );
    if (portfolio) {
      return portfolio.startsWith("http") ? portfolio : `https://${portfolio}`;
    }
  }
  return "";
}

function extractLinkedInUrl(fullText) {
  const linkedinPattern =
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/gi;
  const match = fullText.match(linkedinPattern);
  if (match) {
    return match[0].startsWith("http") ? match[0] : `https://${match[0]}`;
  }
  return "";
}

function extractGitHubUrl(fullText) {
  const githubPattern =
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/gi;
  const match = fullText.match(githubPattern);
  if (match) {
    return match[0].startsWith("http") ? match[0] : `https://${match[0]}`;
  }
  return "";
}

function calculateYearsOfExperience(experiences) {
  if (!experiences || experiences.length === 0) return null;

  let totalYears = 0;
  const currentYear = new Date().getFullYear();

  experiences.forEach((exp) => {
    if (exp.start_date) {
      const startYear = parseInt(exp.start_date.match(/\d{4}/)?.[0]);
      if (startYear) {
        let endYear = currentYear;
        if (exp.end_date && !exp.current) {
          endYear = parseInt(exp.end_date.match(/\d{4}/)?.[0]) || currentYear;
        }
        totalYears += endYear - startYear;
      }
    }
  });

  return totalYears || null;
}

module.exports = { parsePDF };
