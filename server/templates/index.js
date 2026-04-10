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

// Template metadata with enhanced descriptions
const templateMetadata = {
  modern: {
    id: "modern",
    name: "Modern",
    description:
      "Clean, professional design with modern gradients and sleek components. Perfect for corporate portfolios.",
    icon: "LaptopMinimalCheck",
    color: "from-cyan-500 to-blue-500",
    badge: "Popular",
    features: [
      "Gradient color schemes",
      "Profile image support",
      "Interactive animations",
      "Dark mode optimized",
      "Professional layout",
      "Social media links",
    ],
    preview: "/previews/modern.png",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
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
    ],
    preview: "/previews/minimal.png",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description:
      "Bold, artistic design with unique animations and layouts. Suitable for designers and artists to make them stand out.",
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
    ],
    preview: "/previews/creative.png",
  },
  professional: {
    id: "professional",
    name: "Professional",
    description:
      "Traditional, corporate-friendly design that highlights experience and achievements. Ideal for senior positions.",
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
    ],
    preview: "/previews/professional.png",
  },
};

// Add metadata for any new templates automatically
templateFiles.forEach((file) => {
  const templateName = file.replace(".template.js", "");
  if (!templateMetadata[templateName]) {
    // Create default metadata for new templates
    templateMetadata[templateName] = {
      id: templateName,
      name: templateName.charAt(0).toUpperCase() + templateName.slice(1),
      description: `${templateName} template for your resume`,
      icon: "FileText",
      color: "from-gray-500 to-gray-600",
      badge: "New",
      features: [
        "Clean design",
        "Professional layout",
        "Customizable",
        "PDF optimized",
        "Image support",
        "Responsive",
      ],
      preview: `/previews/${templateName}.png`,
    };
  }
});

module.exports = {
  ...templates,
  getAllTemplates: () => {
    return Object.keys(templates).map((key) => ({
      id: key,
      ...templateMetadata[key],
      hasContent: typeof templates[key] === "string",
    }));
  },
  getTemplate: (templateName) => {
    const name = templateName?.toLowerCase();
    return templates[name] || templates.modern;
  },
  getTemplateMetadata: (templateName) => {
    const name = templateName?.toLowerCase();
    return templateMetadata[name] || templateMetadata.modern;
  },
};
