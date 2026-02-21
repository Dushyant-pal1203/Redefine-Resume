// lib/resume-schema.js

/**
 * Generate a unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get empty resume data structure
 */
export function getEmptyResumeData() {
  return {
    personal: {
      full_name: "",
      job_title: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      // Display names
      portfolio_display: "",
      linkedin_display: "",
      github_display: "",
      // URLs
      portfolio_url: "",
      linkedin_url: "",
      github_url: "",
    },
    summary: { summary: "" },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
    projects: [],
    certifications: [],
    languages: [],
    publications: [],
    awards: [],
    volunteering: [],
    interests: [],
    customSections: {},
  };
}

/**
 * Convert from old format (flat) to new flexible format
 */
export function convertToFlexibleFormat(oldData) {
  // Handle null/undefined
  if (!oldData) {
    return getEmptyResumeData();
  }

  // Handle array (sometimes API returns array)
  if (Array.isArray(oldData)) {
    if (oldData.length > 0) {
      oldData = oldData[0];
    } else {
      return getEmptyResumeData();
    }
  }

  // Handle string (sometimes API returns stringified JSON)
  if (typeof oldData === "string") {
    try {
      oldData = JSON.parse(oldData);
    } catch (e) {
      console.error("Failed to parse string data:", e);
      return getEmptyResumeData();
    }
  }

  // Extract display names and URLs properly
  const portfolioDisplay =
    oldData.portfolio_display ||
    oldData.portfolio ||
    oldData.portfolio_name ||
    "";
  const linkedinDisplay =
    oldData.linkedin_display || oldData.linkedin || oldData.linkedin_name || "";
  const githubDisplay =
    oldData.github_display || oldData.github || oldData.github_name || "";

  const portfolioUrl =
    oldData.portfolio_url ||
    (oldData.portfolio ? `https://${oldData.portfolio}` : "") ||
    "";
  const linkedinUrl =
    oldData.linkedin_url ||
    (oldData.linkedin ? `https://linkedin.com/in/${oldData.linkedin}` : "") ||
    "";
  const githubUrl =
    oldData.github_url ||
    (oldData.github ? `https://github.com/${oldData.github}` : "") ||
    "";

  return {
    personal: {
      full_name: oldData.full_name || oldData.name || "",
      job_title: oldData.job_title || oldData.job_title || "",
      headline: oldData.headline || oldData.headline || "",
      email: oldData.email || "",
      phone: oldData.phone || "",
      location: oldData.location || "",
      // Display names
      portfolio_display: portfolioDisplay,
      linkedin_display: linkedinDisplay,
      github_display: githubDisplay,
      // URLs
      portfolio_url: portfolioUrl,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
    },
    summary: {
      summary: oldData.professional_summary || oldData.summary || "",
    },
    experience: Array.isArray(oldData.experience)
      ? oldData.experience.map((exp) => ({
          id: exp.id || generateId(),
          title: exp.title || exp.position || "",
          company: exp.company || "",
          location: exp.location || "",
          start_date: exp.start_date || exp.startDate || "",
          end_date: exp.end_date || exp.endDate || "",
          current: exp.current || false,
          description: exp.description || "",
          achievements: exp.achievements || [],
        }))
      : [],
    education: Array.isArray(oldData.education)
      ? oldData.education.map((edu) => ({
          id: edu.id || generateId(),
          degree: edu.degree || "",
          institution: edu.institution || edu.school || "",
          location: edu.location || "",
          start_date: edu.start_date || edu.startDate || "",
          end_date: edu.end_date || edu.endDate || "",
          current: edu.current || false,
          grade: edu.grade || "",
          description: edu.description || "",
        }))
      : [],
    skills: {
      technical: Array.isArray(oldData.skills)
        ? oldData.skills
        : oldData.technical_skills || [],
      soft: oldData.soft_skills || [],
      languages: oldData.languages || [],
    },
    projects: Array.isArray(oldData.projects)
      ? oldData.projects.map((proj) => ({
          id: proj.id || generateId(),
          name: proj.name || "",
          description: proj.description || "",
          technologies: proj.technologies || [],
          url: proj.url || "",
          start_date: proj.start_date || "",
          end_date: proj.end_date || "",
          current: proj.current || false,
          highlights: proj.highlights || [],
        }))
      : [],
    certifications: Array.isArray(oldData.certifications)
      ? oldData.certifications.map((cert) =>
          typeof cert === "string" ? { name: cert } : cert,
        )
      : [],
    languages: Array.isArray(oldData.languages)
      ? oldData.languages.map((lang) =>
          typeof lang === "string"
            ? { language: lang, proficiency: "Professional" }
            : lang,
        )
      : [],
    publications: Array.isArray(oldData.publications)
      ? oldData.publications
      : [],
    awards: Array.isArray(oldData.awards)
      ? oldData.awards
      : oldData.achievements || [],
    volunteering: Array.isArray(oldData.volunteering)
      ? oldData.volunteering
      : [],
    interests: Array.isArray(oldData.interests) ? oldData.interests : [],
    customSections: oldData.customSections || oldData.parsed_sections || {},
  };
}

/**
 * Convert from database format to flexible format
 */
export function convertDatabaseToFlexibleFormat(dbData) {
  if (!dbData) return getEmptyResumeData();

  return {
    personal: {
      full_name: dbData.full_name || "",
      job_title: dbData.job_title || dbData.job_title || "",
      headline: dbData.headline || dbData.headline || "",
      email: dbData.email || "",
      phone: dbData.phone || "",
      location: dbData.location || "",
      // Display names
      portfolio_display:
        dbData.portfolio_display || dbData.portfolio_name || "",
      linkedin_display: dbData.linkedin_display || dbData.linkedin_name || "",
      github_display: dbData.github_display || dbData.github_name || "",
      // URLs
      portfolio_url: dbData.portfolio_url || "",
      linkedin_url: dbData.linkedin_url || "",
      github_url: dbData.github_url || "",
    },
    summary: {
      summary: dbData.professional_summary || dbData.summary || "",
    },
    experience: Array.isArray(dbData.experience)
      ? dbData.experience.map((exp) => ({
          id: exp.id || generateId(),
          title: exp.title || exp.position || "",
          company: exp.company || "",
          location: exp.location || "",
          start_date: exp.start_date || exp.startDate || "",
          end_date: exp.end_date || exp.endDate || "",
          current: exp.current || false,
          description: exp.description || "",
          achievements: exp.achievements || [],
        }))
      : [],
    education: Array.isArray(dbData.education)
      ? dbData.education.map((edu) => ({
          id: edu.id || generateId(),
          degree: edu.degree || "",
          institution: edu.institution || edu.school || "",
          location: edu.location || "",
          start_date: edu.start_date || edu.startDate || "",
          end_date: edu.end_date || edu.endDate || "",
          current: edu.current || false,
          grade: edu.grade || "",
          description: edu.description || "",
        }))
      : [],
    skills: {
      technical: Array.isArray(dbData.skills)
        ? dbData.skills
        : dbData.technical_skills || [],
      soft: dbData.soft_skills || [],
      languages: Array.isArray(dbData.languages)
        ? dbData.languages.map((l) =>
            typeof l === "string" ? l : l.name || "",
          )
        : [],
    },
    projects: Array.isArray(dbData.projects)
      ? dbData.projects.map((proj) => ({
          id: proj.id || generateId(),
          name: proj.name || "",
          description: proj.description || "",
          technologies: proj.technologies || [],
          url: proj.url || "",
          start_date: proj.start_date || "",
          end_date: proj.end_date || "",
          current: proj.current || false,
          highlights: proj.highlights || [],
        }))
      : [],
    certifications: Array.isArray(dbData.certifications)
      ? dbData.certifications.map((cert) =>
          typeof cert === "string" ? { name: cert } : cert,
        )
      : [],
    languages: Array.isArray(dbData.languages)
      ? dbData.languages.map((lang) =>
          typeof lang === "string"
            ? { language: lang, proficiency: "Professional" }
            : lang,
        )
      : [],
    publications: Array.isArray(dbData.publications) ? dbData.publications : [],
    awards: Array.isArray(dbData.awards)
      ? dbData.awards
      : dbData.achievements || [],
    volunteering: Array.isArray(dbData.volunteering) ? dbData.volunteering : [],
    interests: Array.isArray(dbData.interests) ? dbData.interests : [],
    customSections: dbData.parsed_sections || {},
  };
}

/**
 * Convert from flexible format to old format (for API compatibility)
 */
export function convertToOldFormat(flexibleData) {
  const personal = flexibleData.personal || {};
  const summary = flexibleData.summary || {};
  const skills = flexibleData.skills || {};

  // Helper function to validate URL
  const cleanUrl = (url) => {
    if (!url) return "";
    try {
      new URL(url);
      return url;
    } catch {
      // If invalid, return empty string
      return "";
    }
  };

  return {
    full_name: personal.full_name || "",
    job_title: personal.job_title || "",
    headline: personal.headline || "",
    email: personal.email || "",
    phone: personal.phone || "",
    location: personal.location || "",
    // Display names
    portfolio_display: personal.portfolio_display || "",
    linkedin_display: personal.linkedin_display || "",
    github_display: personal.github_display || "",
    // URLs - clean them before sending
    portfolio_url: cleanUrl(personal.portfolio_url || ""),
    linkedin_url: cleanUrl(personal.linkedin_url || ""),
    github_url: cleanUrl(personal.github_url || ""),
    professional_summary: summary.summary || "",
    experience: flexibleData.experience || [],
    education: flexibleData.education || [],
    skills: [...(skills.technical || []), ...(skills.soft || [])],
    technical_skills: skills.technical || [],
    soft_skills: skills.soft || [],
    languages: skills.languages || flexibleData.languages || [],
    projects: (flexibleData.projects || []).map((project) => ({
      ...project,
      url: cleanUrl(project.url || ""),
    })),
    certifications: (flexibleData.certifications || []).map((cert) => ({
      ...cert,
      url: cleanUrl(cert.url || ""),
    })),
    publications: flexibleData.publications || [],
    awards: flexibleData.awards || [],
    volunteering: flexibleData.volunteering || [],
    interests: flexibleData.interests || [],
  };
}

/**
 * Validate resume data
 */
export function validateResumeData(data) {
  const errors = [];

  // Personal info validation
  const personal = data.personal || {};
  if (!personal.full_name?.trim()) {
    errors.push({
      field: "personal.full_name",
      message: "Full name is required",
    });
  }

  if (!personal.email?.trim()) {
    errors.push({ field: "personal.email", message: "Email is required" });
  } else if (!/\S+@\S+\.\S+/.test(personal.email)) {
    errors.push({ field: "personal.email", message: "Invalid email format" });
  }

  // Experience validation
  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp, index) => {
      if (!exp.title?.trim()) {
        errors.push({
          field: `experience[${index}].title`,
          message: "Job title is required",
        });
      }
      if (!exp.company?.trim()) {
        errors.push({
          field: `experience[${index}].company`,
          message: "Company is required",
        });
      }
    });
  }

  // Education validation
  if (Array.isArray(data.education)) {
    data.education.forEach((edu, index) => {
      if (!edu.degree?.trim()) {
        errors.push({
          field: `education[${index}].degree`,
          message: "Degree is required",
        });
      }
      if (!edu.institution?.trim()) {
        errors.push({
          field: `education[${index}].institution`,
          message: "Institution is required",
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
