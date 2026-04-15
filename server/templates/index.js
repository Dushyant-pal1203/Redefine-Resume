// templates/index.js
const fs = require("fs");
const path = require("path");

// Auto-discover all template files
const templateFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".template.js") && file !== "index.js");

const templates = {};

// Dynamically load all templates
templateFiles.forEach((file) => {
  const templateName = file.replace(".template.js", "");
  templates[templateName] = require(`./${file}`);
});

// Enhanced template metadata with preview image support
const templateMetadata = {
  modern: {
    id: "modern",
    name: "Modern Pro",
    description:
      "Clean, professional design with modern gradients and sleek components. Perfect for corporate portfolios and tech professionals.",
    icon: "LaptopMinimalCheck",
    color: "from-cyan-500 to-blue-500",
    badge: "Most Popular",
    features: [
      "Gradient color schemes",
      "Profile image support",
      "Interactive animations",
      "Dark mode optimized",
      "Professional layout",
      "Social media links",
      "ATS-friendly formatting",
    ],
    previewImage: "/images/templates/modern-preview.png",
    thumbnail: "/images/templates/modern-preview.webp",
    category: "professional",
    popularity: 98,
    tags: ["corporate", "tech", "modern", "gradient"],
    layouts: ["single-column", "two-column"],
    colors: ["cyan", "blue", "white"],
  },
  minimal: {
    id: "minimal",
    name: "Minimalist",
    description:
      "Simple, elegant design with clean typography. Focus on content with minimal distractions and fast loading.",
    icon: "Codesandbox",
    color: "from-emerald-400 to-green-400",
    badge: "Lightweight",
    features: [
      "Clean typography",
      "Profile image support",
      "Fast loading",
      "Mobile-first design",
      "Content-focused",
      "Print optimized",
      "High readability",
    ],
    previewImage: "/images/templates/minimal-preview.png",
    thumbnail: "/images/templates/minimal-preview.webp",
    category: "simple",
    popularity: 92,
    tags: ["minimal", "elegant", "clean", "simple"],
    layouts: ["single-column"],
    colors: ["emerald", "green", "gray"],
  },
  creative: {
    id: "creative",
    name: "Creative Studio",
    description:
      "Bold, artistic design with unique animations and layouts. Suitable for designers, artists, and creative professionals.",
    icon: "Component",
    color: "from-purple-500 to-pink-500",
    badge: "Artistic",
    features: [
      "Unique animations",
      "Profile image with effects",
      "Custom illustrations",
      "Artistic layouts",
      "Stand out design",
      "Portfolio showcase",
      "Creative typography",
    ],
    previewImage: "/images/templates/creative-preview.png",
    thumbnail: "/images/templates/creative-preview.webp",
    category: "creative",
    popularity: 89,
    tags: ["creative", "artistic", "designer", "portfolio"],
    layouts: ["two-column", "grid"],
    colors: ["purple", "pink", "violet"],
  },
  professional: {
    id: "professional",
    name: "Executive Professional",
    description:
      "Traditional, corporate-friendly design that highlights experience and achievements. Ideal for senior positions and executives.",
    icon: "Briefcase",
    color: "from-blue-600 to-indigo-600",
    badge: "Corporate",
    features: [
      "Traditional layout",
      "Professional image placement",
      "Experience focused",
      "Achievement highlights",
      "Skill proficiency bars",
      "ATS friendly",
      "Executive summary section",
    ],
    previewImage: "/images/templates/professional-preview.png",
    thumbnail: "/images/templates/professional-preview.webp",
    category: "corporate",
    popularity: 95,
    tags: ["corporate", "executive", "traditional", "business"],
    layouts: ["single-column", "two-column"],
    colors: ["blue", "indigo", "navy"],
  },
  tech: {
    id: "tech",
    name: "Tech Innovator",
    description:
      "Modern design for tech professionals featuring skill tags, project showcases, and achievement metrics.",
    icon: "Code2",
    color: "from-slate-500 to-blue-500",
    badge: "Tech Focused",
    features: [
      "Skill tags visualization",
      "Project showcase",
      "GitHub integration",
      "Achievement metrics",
      "Tech stack highlights",
      "Contributions graph",
      "Certifications section",
    ],
    previewImage: "/images/templates/tech-preview.webp",
    thumbnail: "/images/templates/tech-preview.webp",
    category: "professional",
    popularity: 96,
    tags: ["tech", "developer", "engineer", "programmer"],
    layouts: ["two-column", "grid"],
    colors: ["slate", "blue", "cyan"],
  },
  academic: {
    id: "academic",
    name: "Academic",
    description:
      "Research-focused design with publications, conferences, and academic achievements highlight.",
    icon: "GraduationCap",
    color: "from-amber-500 to-orange-500",
    badge: "Academic",
    features: [
      "Publications section",
      "Research highlights",
      "Conference presentations",
      "Teaching experience",
      "Citations counter",
      "GPA display",
      "Language proficiencies",
    ],
    previewImage: "/images/templates/academic-preview.webp",
    thumbnail: "/images/templates/academic-preview.webp",
    category: "specialized",
    popularity: 88,
    tags: ["academic", "research", "education", "scholar"],
    layouts: ["single-column"],
    colors: ["amber", "orange", "brown"],
  },
};

// Categories for filtering
const templateCategories = {
  all: "All Templates",
  professional: "Professional",
  creative: "Creative & Artistic",
  simple: "Simple & Minimal",
  corporate: "Corporate",
  specialized: "Specialized",
};

// Helper function to check if preview image exists
const getPreviewImagePath = (templateName, type = "preview") => {
  const possibleExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const basePath = path.join(process.cwd(), "public", "images", "templates");
  const fileName = `${templateName}-${type}`;

  for (const ext of possibleExtensions) {
    const fullPath = path.join(basePath, `${fileName}${ext}`);
    if (fs.existsSync(fullPath)) {
      return `/images/templates/${fileName}${ext}`;
    }
  }

  // Return null if no image found
  return null;
};

// Add metadata for any new templates automatically
templateFiles.forEach((file) => {
  const templateName = file.replace(".template.js", "");
  if (!templateMetadata[templateName]) {
    // Check for existing preview images
    const previewImage = getPreviewImagePath(templateName, "preview");
    const thumbnail = getPreviewImagePath(templateName, "thumb");

    // Create enhanced default metadata for new templates
    templateMetadata[templateName] = {
      id: templateName,
      name: templateName.charAt(0).toUpperCase() + templateName.slice(1),
      description: `${templateName} template - Professional design for your resume`,
      icon: "FileText",
      color: "from-gray-500 to-gray-600",
      badge: "New",
      features: [
        "Clean design",
        "Professional layout",
        "Fully customizable",
        "PDF optimized",
        "Image support",
        "Responsive design",
        "ATS-friendly",
      ],
      previewImage: previewImage || null,
      thumbnail: thumbnail || null,
      category: "professional",
      popularity: 75,
      tags: ["new", "professional", "modern"],
      layouts: ["single-column"],
      colors: ["gray", "white"],
    };
  } else {
    // For existing templates, ensure preview images are set if they exist
    const metadata = templateMetadata[templateName];
    if (!metadata.previewImage) {
      const previewImage = getPreviewImagePath(templateName, "preview");
      if (previewImage) {
        metadata.previewImage = previewImage;
      }
    }
    if (!metadata.thumbnail) {
      const thumbnail = getPreviewImagePath(templateName, "thumb");
      if (thumbnail) {
        metadata.thumbnail = thumbnail;
      }
    }
  }
});

// Sort templates by popularity
const getSortedTemplates = (templatesList, sortBy = "popularity") => {
  return [...templatesList].sort((a, b) => {
    if (sortBy === "popularity") {
      return (b.popularity || 0) - (a.popularity || 0);
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
};

// Filter templates by category
const filterTemplatesByCategory = (templatesList, category) => {
  if (category === "all" || !category) {
    return templatesList;
  }
  return templatesList.filter((template) => template.category === category);
};

module.exports = {
  ...templates,

  // Get all templates with metadata
  getAllTemplates: (options = {}) => {
    const { category = "all", sortBy = "popularity" } = options;

    let templatesList = Object.keys(templates).map((key) => ({
      id: key,
      ...templateMetadata[key],
      hasContent: typeof templates[key] === "string",
    }));

    // Apply category filter
    templatesList = filterTemplatesByCategory(templatesList, category);

    // Apply sorting
    templatesList = getSortedTemplates(templatesList, sortBy);

    return templatesList;
  },

  // Get featured templates (top 3 by popularity)
  getFeaturedTemplates: (limit = 3) => {
    const allTemplates = module.exports.getAllTemplates({
      sortBy: "popularity",
    });
    return allTemplates.slice(0, limit);
  },

  // Get template by ID
  getTemplate: (templateName) => {
    const name = templateName?.toLowerCase();
    return templates[name] || templates.modern;
  },

  // Get template metadata
  getTemplateMetadata: (templateName) => {
    const name = templateName?.toLowerCase();
    return templateMetadata[name] || templateMetadata.modern;
  },

  // Get all template categories
  getCategories: () => {
    return templateCategories;
  },

  // Search templates
  searchTemplates: (query) => {
    const searchTerm = query.toLowerCase();
    const allTemplates = module.exports.getAllTemplates();

    return allTemplates.filter((template) => {
      return (
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        template.features?.some((feature) =>
          feature.toLowerCase().includes(searchTerm),
        )
      );
    });
  },

  // Get related templates
  getRelatedTemplates: (templateId, limit = 3) => {
    const template = templateMetadata[templateId];
    if (!template) return [];

    const allTemplates = module.exports.getAllTemplates();

    return allTemplates
      .filter((t) => t.id !== templateId && t.category === template.category)
      .slice(0, limit);
  },

  // Check if template has preview image
  hasPreviewImage: (templateName) => {
    const metadata = templateMetadata[templateName];
    return !!metadata?.previewImage;
  },

  // Get template statistics
  getTemplateStats: () => {
    const allTemplates = module.exports.getAllTemplates();
    const categories = {};

    allTemplates.forEach((template) => {
      const category = template.category || "uncategorized";
      categories[category] = (categories[category] || 0) + 1;
    });

    return {
      total: allTemplates.length,
      categories,
      averagePopularity: Math.round(
        allTemplates.reduce((sum, t) => sum + (t.popularity || 0), 0) /
          allTemplates.length,
      ),
    };
  },
};
