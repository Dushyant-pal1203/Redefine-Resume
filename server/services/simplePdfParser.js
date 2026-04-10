// server/services/simplePdfParser.js
const pdf2json = require("pdf2json");

async function parsePDFSimple(buffer) {
  console.log("🔍 Starting simple PDF parsing...");

  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json(null, 1);
    let extractedText = "";
    let allTexts = [];
    let textWithPositions = [];

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

        if (pdfData.Pages && pdfData.Pages.length > 0) {
          pdfData.Pages.forEach((page, pageIndex) => {
            console.log(`📄 Processing page ${pageIndex + 1}`);

            if (page.Texts && page.Texts.length > 0) {
              // Sort texts by Y position to maintain reading order
              const sortedTexts = [...page.Texts].sort(
                (a, b) => (a.y || 0) - (b.y || 0),
              );

              sortedTexts.forEach((text) => {
                try {
                  const decoded = decodeURIComponent(text.R[0].T || "");
                  if (decoded && decoded.trim()) {
                    allTexts.push(decoded);
                    extractedText += decoded + " ";
                    textWithPositions.push({
                      text: decoded,
                      y: text.y || 0,
                      x: text.x || 0,
                      page: pageIndex + 1,
                    });
                  }
                } catch (e) {
                  console.log(`⚠️ Failed to decode text`);
                }
              });
            }
          });
        }

        console.log(`📝 Extracted ${allTexts.length} text blocks`);
        console.log(`📝 Total extracted text length: ${extractedText.length}`);

        if (extractedText.length === 0) {
          reject(
            new Error(
              "No text could be extracted from the PDF. The file might be a scanned image.",
            ),
          );
          return;
        }

        // Show first 500 characters for debugging
        console.log("📝 Text preview:", extractedText.substring(0, 500));

        // Parse the extracted text
        const parsedData = parseTextToResumeImproved(
          extractedText,
          allTexts,
          textWithPositions,
        );

        resolve(parsedData);
      } catch (error) {
        console.error("❌ Error processing parsed data:", error);
        reject(new Error(`Error processing PDF data: ${error.message}`));
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

function parseTextToResumeImproved(fullText, allTexts, textWithPositions) {
  console.log("🔍 Parsing text to resume structure...");

  // Clean the text
  let cleanText = fullText.replace(/\s+/g, " ").trim();

  // Fix common PDF artifacts
  cleanText = cleanText.replace(/([A-Z])\s+(?=[A-Z])/g, "$1"); // Fix spaced capitals
  cleanText = cleanText.replace(/([a-z])\s+([a-z])/g, "$1$2"); // Fix spaced lowercase

  // Split into lines (by periods, question marks, exclamations, or new lines)
  const lines = cleanText
    .split(/[.!?]\s+|\n/)
    .filter((l) => l.trim().length > 0);

  console.log(`📄 Split into ${lines.length} lines/sentences`);
  console.log("📄 First 10 lines:", lines.slice(0, 10));

  // Extract information with improved methods
  const fullName = extractNameImproved(cleanText, lines, allTexts);
  const email = extractEmailImproved(cleanText);
  const phone = extractPhoneImproved(cleanText);
  const location = extractLocationImproved(cleanText, lines);
  const jobTitle = extractJobTitleImproved(cleanText, lines);
  const summary = extractSummaryImproved(cleanText, lines);
  const skills = extractSkillsImproved(cleanText, lines);
  const experience = extractExperienceImproved(cleanText, lines);
  const education = extractEducationImproved(cleanText, lines);

  console.log("✅ Parsing complete:", {
    name: fullName || "Not found",
    email: email || "Not found",
    phone: phone || "Not found",
    jobTitle: jobTitle || "Not found",
    location: location || "Not found",
    skillsCount: skills.length,
    experienceCount: experience.length,
    educationCount: education.length,
  });

  return {
    full_name: fullName,
    job_title: jobTitle,
    headline: jobTitle,
    email: email,
    phone: phone,
    location: location,
    professional_summary: summary,
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    links: [],
    experience: experience,
    education: education,
    projects: [],
    skills: skills,
    certifications: [],
    achievements: [],
    languages: [],
    keywords: [],
    parsed_sections: {},
    years_of_experience: null,
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
    linkedin_display: null,
    github_display: null,
  };
}

function extractNameImproved(text, lines, allTexts) {
  // Look at first 10 text blocks (often name is in the first few)
  for (let i = 0; i < Math.min(10, allTexts.length); i++) {
    const block = allTexts[i].trim();
    if (!block) continue;

    // Skip blocks that are clearly not names
    if (block.includes("@") || block.includes("http") || block.includes("www"))
      continue;
    if (
      block
        .toLowerCase()
        .match(/^(resume|cv|curriculum|vitae|contact|phone|email)/i)
    )
      continue;

    // Check if block has 2-4 words
    const words = block.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      // Check if it looks like a name (starts with capitals or all caps)
      const looksLikeName = words.every(
        (word) => /^[A-Z]/.test(word) || /^[A-Z]+$/.test(word),
      );
      if (looksLikeName && block.length < 50 && block.length > 5) {
        return block;
      }
    }
  }

  // Look at first 5 lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip lines that are clearly not names
    if (line.includes("@") || line.includes("http") || line.includes("www"))
      continue;
    if (
      line
        .toLowerCase()
        .match(
          /^(resume|cv|curriculum|vitae|contact|phone|email|summary|profile)/i,
        )
    )
      continue;

    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      // Check if each word starts with capital letter
      const looksLikeName = words.every(
        (word) => /^[A-Z]/.test(word) || /^[A-Z]+$/.test(word),
      );
      if (looksLikeName && line.length < 50 && line.length > 5) {
        return line;
      }
    }
  }

  // Try to find pattern like "ADITYA PAL" or "Aditya Pal"
  const patterns = [
    /([A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)?)/, // Aditya Pal
    /([A-Z]+ [A-Z]+(?: [A-Z]+)?)/, // ADITYA PAL
    /([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)/, // Aditya P. Pal
    /([A-Z][a-z]+(?:-[A-Z][a-z]+)? [A-Z][a-z]+)/, // Aditya-Pal
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 3 && match[1].length < 50) {
      // Clean up the name
      let name = match[1].trim();
      // Fix any remaining spacing issues
      name = name.replace(/\s+/g, " ");
      if (name.length > 3) {
        return name;
      }
    }
  }

  return "";
}

function extractEmailImproved(text) {
  // First, clean the text by removing spaces around @ and .
  let cleanedText = text.replace(/\s*@\s*/g, "@");
  cleanedText = cleanedText.replace(/\s*\.\s*/g, ".");

  const patterns = [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /[a-zA-Z0-9._%+-]+\s*@\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}/g,
  ];

  for (const pattern of patterns) {
    const matches = cleanedText.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0].replace(/\s/g, "").toLowerCase();
    }
  }

  return "";
}

function extractPhoneImproved(text) {
  // Remove all non-digit characters except +
  const cleaned = text.replace(/[^\d+]/g, " ");

  // Look for 10-digit numbers
  const digits = cleaned.replace(/\D/g, "");
  const phoneMatch = digits.match(/\d{10}/);
  if (phoneMatch) {
    return phoneMatch[0];
  }

  // Look for formatted phone numbers
  const formattedPattern =
    /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const formattedMatch = text.match(formattedPattern);
  if (formattedMatch) {
    return formattedMatch[0].replace(/[^0-9+]/g, "");
  }

  return "";
}

function extractLocationImproved(text, lines) {
  const locationKeywords = [
    "location",
    "address",
    "based in",
    "from",
    "city",
    "country",
  ];
  const patterns = [
    /([A-Z][a-z]+,\s*[A-Z]{2})/, // City, ST
    /([A-Z][a-z]+,\s*[A-Z][a-z]+)/, // City, Country
    /([A-Z][a-z]+\s+[A-Z][a-z]+)/, // City State
    /([A-Z]{2,}(?:\s+[A-Z]{2,})?)/, // ALL CAPS
  ];

  // Look in first 20 lines for location
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Check if this line has location keywords
    if (locationKeywords.some((keyword) => lowerLine.includes(keyword))) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && match[1] && match[1].length < 50) {
          return match[1];
        }
      }
    }
  }

  // Check for common location patterns in early lines
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (
        match &&
        match[1] &&
        !match[1].includes("@") &&
        !match[1].includes("http") &&
        match[1].length < 50
      ) {
        return match[1];
      }
    }
  }

  return "";
}

function extractJobTitleImproved(text, lines) {
  const titleKeywords = [
    "developer",
    "engineer",
    "designer",
    "architect",
    "manager",
    "lead",
    "specialist",
    "consultant",
    "analyst",
    "administrator",
    "director",
    "full stack",
    "frontend",
    "backend",
    "software",
    "web",
    "mobile",
    "data scientist",
    "devops",
    "qa",
    "product",
    "project",
    "technical",
  ];

  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    for (const keyword of titleKeywords) {
      if (lowerLine.includes(keyword)) {
        // Extract the phrase containing the keyword
        const words = line.split(/\s+/);
        let start = Math.max(
          0,
          words.findIndex((w) => w.toLowerCase().includes(keyword)) - 1,
        );
        let end = Math.min(words.length, start + 5);
        const title = words.slice(start, end).join(" ");
        if (title.length > 3 && title.length < 100) {
          return title;
        }
      }
    }
  }

  return "";
}

function extractSummaryImproved(text, lines) {
  let summaryStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (
      line.includes("summary") ||
      line.includes("profile") ||
      line.includes("objective") ||
      line.includes("about me")
    ) {
      summaryStart = i + 1;
      break;
    }
  }

  if (summaryStart === -1) return "";

  let summary = [];
  for (
    let i = summaryStart;
    i < Math.min(summaryStart + 8, lines.length);
    i++
  ) {
    const line = lines[i];
    if (
      line
        .toLowerCase()
        .match(/^(skills|experience|education|work|projects|certifications)/)
    )
      break;
    if (line.length > 30 && !line.includes("@") && !line.includes("http")) {
      summary.push(line);
    }
  }

  return summary.join(" ");
}

function extractSkillsImproved(text, lines) {
  const skills = new Set();

  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "Next.js",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "GCP",
    "Angular",
    "Vue.js",
    "PHP",
    "Ruby",
    "C++",
    "C#",
    "Go",
    "GraphQL",
    "REST API",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Tailwind CSS",
    "Bootstrap",
    "Redux",
    "Firebase",
    "Redis",
    "Kubernetes",
    "Jenkins",
    "Figma",
    "Photoshop",
    "Illustrator",
    "Framer",
    "Webpack",
    "Vite",
  ];

  // Look for skills section
  let inSkillsSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("skills") ||
      lowerLine.includes("technologies") ||
      lowerLine.includes("tech stack") ||
      lowerLine.includes("core competencies")
    ) {
      inSkillsSection = true;
      continue;
    }

    if (inSkillsSection) {
      if (
        lowerLine.match(
          /^(experience|education|work|projects|certifications|contact)/,
        )
      )
        break;

      // Split by commas, bullets, pipes, or spaces
      const candidates = line.split(/[•,•\n\t|]/);
      for (const candidate of candidates) {
        let trimmed = candidate.trim();
        // Remove common punctuation
        trimmed = trimmed.replace(/[.,;:]$/, "");

        if (trimmed.length > 2 && trimmed.length < 40) {
          for (const skill of commonSkills) {
            if (
              trimmed.toLowerCase() === skill.toLowerCase() ||
              trimmed.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(trimmed.toLowerCase())
            ) {
              skills.add(skill);
              break;
            }
          }
        }
      }
    }
  }

  // If no skills section found, scan all text for skills
  if (skills.size === 0) {
    for (const skill of commonSkills) {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    }
  }

  // Also check for comma-separated lists in the first few lines
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i];
    if (line.includes(",") && line.length < 200) {
      const parts = line.split(",");
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.length > 2 && trimmed.length < 40) {
          for (const skill of commonSkills) {
            if (trimmed.toLowerCase().includes(skill.toLowerCase())) {
              skills.add(skill);
              break;
            }
          }
        }
      }
    }
  }

  return Array.from(skills).slice(0, 25);
}

function extractExperienceImproved(text, lines) {
  const experiences = [];
  let inExpSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("work experience") ||
      lowerLine.includes("employment") ||
      lowerLine.includes("professional experience")
    ) {
      inExpSection = true;
      continue;
    }

    if (inExpSection) {
      if (
        lowerLine.match(/^(education|skills|projects|certifications|contact)/)
      )
        break;

      // Look for date patterns (YYYY - YYYY or YYYY - Present)
      const datePattern =
        /\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b|\b(19|20)\d{2}\s*[-–]\s*present\b/i;
      if (datePattern.test(line) && line.length < 150) {
        const exp = {
          title: i > 0 ? lines[i - 1] : "",
          company: line,
          start_date: "",
          end_date: "",
          current: false,
          description: "",
        };

        // Extract dates
        const dates = line.match(/\d{4}/g);
        if (dates && dates.length >= 2) {
          exp.start_date = dates[0];
          exp.end_date = dates[1];
        } else if (
          dates &&
          dates.length === 1 &&
          line.toLowerCase().includes("present")
        ) {
          exp.start_date = dates[0];
          exp.current = true;
        }

        // Add description if available
        if (i + 1 < lines.length && lines[i + 1].length > 30) {
          exp.description = lines[i + 1];
        }

        experiences.push(exp);
      }
    }
  }

  return experiences;
}

function extractEducationImproved(text, lines) {
  const education = [];
  let inEduSection = false;

  const degreeKeywords = [
    "bachelor",
    "master",
    "phd",
    "mca",
    "bca",
    "btech",
    "mtech",
    "bs",
    "ms",
    "ba",
    "ma",
    "diploma",
    "associate",
    "certificate",
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("education") ||
      lowerLine.includes("academic background")
    ) {
      inEduSection = true;
      continue;
    }

    if (inEduSection) {
      if (
        lowerLine.match(
          /^(skills|experience|work|projects|certifications|contact)/,
        )
      )
        break;

      const hasDegree = degreeKeywords.some((keyword) =>
        lowerLine.includes(keyword),
      );
      const hasInstitution =
        lowerLine.includes("university") ||
        lowerLine.includes("college") ||
        lowerLine.includes("institute") ||
        lowerLine.includes("school");

      if ((hasDegree || hasInstitution) && line.length < 150) {
        const edu = {
          degree: hasDegree ? line : "",
          institution: hasInstitution ? line : "",
          start_date: "",
          end_date: "",
          grade: "",
        };

        // Extract dates
        const dates = line.match(/\d{4}/g);
        if (dates && dates.length >= 2) {
          edu.start_date = dates[0];
          edu.end_date = dates[1];
        }

        education.push(edu);
      }
    }
  }

  return education;
}

module.exports = { parsePDFSimple };
