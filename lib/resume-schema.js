// lib/resume-schema.js

/**
 * Generate a unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

  return {
    personal: {
      full_name: oldData.full_name || oldData.name || "",
      headline: oldData.headline || oldData.job_title || "",
      email: oldData.email || "",
      phone: oldData.phone || "",
      location: oldData.location || "",
      website: oldData.website || oldData.portfolio_url || "",
      linkedin: oldData.linkedin || oldData.linkedin_url || "",
      github: oldData.github || oldData.github_url || "",
      twitter: oldData.twitter || oldData.twitter_url || "",
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
      technical: Array.isArray(oldData.skills) ? oldData.skills : [],
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
    certifications: oldData.certifications || [],
    languages: oldData.languages || [],
    publications: oldData.publications || [],
    awards: oldData.awards || oldData.achievements || [],
    volunteering: oldData.volunteering || [],
    interests: oldData.interests || [],
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
      headline: dbData.job_title || dbData.headline || "",
      email: dbData.email || "", // Will be empty if not found
      phone: dbData.phone || "",
      location: dbData.location || "",
      website: dbData.portfolio_url || dbData.website || "",
      linkedin: dbData.linkedin_url || dbData.linkedin || "",
      github: dbData.github_url || dbData.github || "",
      twitter: dbData.twitter_url || dbData.twitter || "",
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
      technical: Array.isArray(dbData.skills) ? dbData.skills : [],
      soft: [],
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
      ? dbData.certifications
      : [],
    languages: Array.isArray(dbData.languages) ? dbData.languages : [],
    publications: [],
    awards: Array.isArray(dbData.achievements) ? dbData.achievements : [],
    volunteering: [],
    interests: [],
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

  return {
    full_name: personal.full_name || "",
    headline: personal.headline || "",
    email: personal.email || "",
    phone: personal.phone || "",
    location: personal.location || "",
    website: personal.website || "",
    linkedin: personal.linkedin || "",
    github: personal.github || "",
    twitter: personal.twitter || "",
    professional_summary: summary.summary || "",
    experience: flexibleData.experience || [],
    education: flexibleData.education || [],
    skills: [...(skills.technical || []), ...(skills.soft || [])],
    soft_skills: skills.soft || [],
    languages: skills.languages || flexibleData.languages || [],
    projects: flexibleData.projects || [],
    certifications: flexibleData.certifications || [],
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

function getEmptyResumeData() {
  return {
    personal: {
      full_name: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      twitter: "",
    },
    summary: { summary: "" },
    experience: [],
    education: [],
    skills: { technical: [], soft: [], languages: [] },
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
