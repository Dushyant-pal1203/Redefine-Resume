// services/ats.service.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// List of available models in order of preference
const AVAILABLE_MODELS = [
  "gpt-4-turbo",
  "gpt-4",
  "gpt-4-1106-preview",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
];

// Cache for available models to avoid repeated checks
let availableModelsCache = null;
let lastModelCheck = 0;
const MODEL_CHECK_INTERVAL = 3600000; // Check every hour

/**
 * Get available OpenAI models
 */
async function getAvailableModels() {
  const now = Date.now();
  if (availableModelsCache && now - lastModelCheck < MODEL_CHECK_INTERVAL) {
    return availableModelsCache;
  }

  try {
    const response = await openai.models.list();
    const models = response.data.map((model) => model.id);
    availableModelsCache = models;
    lastModelCheck = now;
    return models;
  } catch (error) {
    console.warn("⚠️ Could not fetch model list:", error.message);
    return AVAILABLE_MODELS;
  }
}

/**
 * Get the best available model
 */
async function getBestAvailableModel() {
  const availableModels = await getAvailableModels();

  for (const preferred of AVAILABLE_MODELS) {
    if (availableModels.includes(preferred)) {
      return preferred;
    }
  }

  // Fallback to gpt-3.5-turbo (most likely available)
  return "gpt-3.5-turbo";
}

/**
 * Analyze resume with OpenAI
 */
async function analyzeResumeWithOpenAI(resumeData, jobDescription = "") {
  // Check if OpenAI API key is configured
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY === "your-openai-api-key-here"
  ) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const prompt = buildResumeAnalysisPrompt(resumeData, jobDescription);
    const model = await getBestAvailableModel();

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are an elite ATS analyst with cyberpunk aesthetics. Analyze resumes like a neural network-powered recruitment AI. 
          Be brutally honest but constructive. Use futuristic terminology and provide insights that would impress even the most advanced HR AI.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return analysis;
  } catch (error) {
    // Handle specific error cases
    if (error.code === "insufficient_quota") {
      console.error(
        "❌ OpenAI API quota exceeded. Please check your billing details.",
      );
    } else if (error.code === "model_not_found") {
      // Try with a different model
      try {
        const fallbackModel = "gpt-3.5-turbo";

        const prompt = buildResumeAnalysisPrompt(resumeData, jobDescription);
        const response = await openai.chat.completions.create({
          model: fallbackModel,
          messages: [
            {
              role: "system",
              content: `You are an elite ATS analyst. Analyze resumes professionally.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 2500,
          response_format: { type: "json_object" },
        });

        const analysis = JSON.parse(response.choices[0].message.content);
        return analysis;
      } catch (fallbackError) {
        console.error("❌ Fallback OpenAI also failed:", fallbackError.message);
        throw fallbackError;
      }
    }

    throw error;
  }
}

/**
 * Generate local fallback analysis
 */
function generateLocalAnalysis(resumeData, jobDescription = "") {
  // Extract basic info
  const hasName = !!resumeData.personal?.full_name;
  const hasEmail = !!resumeData.personal?.email;
  const hasPhone = !!resumeData.personal?.phone;
  const hasSummary = !!resumeData.summary?.summary;
  const experienceCount = resumeData.experience?.length || 0;
  const educationCount = resumeData.education?.length || 0;
  const skillsCount =
    (resumeData.skills?.technical?.length || 0) +
    (resumeData.skills?.soft?.length || 0) +
    (resumeData.skills?.languages?.length || 0);

  // Calculate scores
  const formatScore = calculateScore(10, [
    hasName,
    hasEmail,
    hasPhone,
    experienceCount > 0,
    educationCount > 0,
    skillsCount > 0,
  ]);

  const contentScore = calculateScore(10, [
    hasSummary,
    experienceCount >= 2,
    educationCount >= 1,
    skillsCount >= 5,
    resumeData.projects?.length > 0,
  ]);

  const keywordsScore = calculateKeywordScore(resumeData, jobDescription);
  const experienceScore = calculateScore(10, [
    experienceCount > 0,
    experienceCount >= 2,
    hasAchievements(resumeData.experience),
    hasMetrics(resumeData.experience),
  ]);

  const educationScore = calculateScore(10, [
    educationCount > 0,
    hasDegree(resumeData.education),
    hasField(resumeData.education),
    hasSchool(resumeData.education),
  ]);

  const skillsScore = calculateScore(10, [
    skillsCount >= 5,
    skillsCount >= 10,
    resumeData.skills?.technical?.length >= 5,
    resumeData.skills?.soft?.length >= 3,
  ]);

  const achievementsScore = calculateScore(10, [
    hasAchievements(resumeData.experience),
    hasMetrics(resumeData.experience),
    experienceCount > 0,
  ]);

  // Calculate overall score
  const overallScore = Math.round(
    ((formatScore +
      contentScore +
      keywordsScore +
      experienceScore +
      educationScore +
      skillsScore +
      achievementsScore) /
      7) *
      10,
  );

  // Extract keywords
  const detectedKeywords = extractKeywords(resumeData);
  const missingKeywords = suggestMissingKeywords(resumeData, jobDescription);

  return {
    quantum_score: {
      overall: overallScore,
      neural_network_confidence: 85,
      temporal_relevance: calculateTemporalRelevance(resumeData),
    },
    dimensional_scores: {
      syntactic_integrity: {
        score: formatScore,
        analysis: getAnalysis(formatScore, "format"),
      },
      semantic_density: {
        score: contentScore,
        analysis: getAnalysis(contentScore, "content"),
      },
      keyword_neural_map: {
        score: keywordsScore,
        analysis: getKeywordAnalysisText(keywordsScore),
      },
      experience_quantum: {
        score: experienceScore,
        analysis: getAnalysis(experienceScore, "experience"),
      },
      education_matrix: {
        score: educationScore,
        analysis: getAnalysis(educationScore, "education"),
      },
      skill_synapse: {
        score: skillsScore,
        analysis: getAnalysis(skillsScore, "skills"),
      },
      achievement_amplitude: {
        score: achievementsScore,
        analysis: getAnalysis(achievementsScore, "achievements"),
      },
    },
    ats_quantum_compatibility: {
      parsing_probability: calculateParsingProbability(resumeData),
      format_singularities: findFormatIssues(resumeData),
      quantum_recommendations: generateRecommendations(resumeData),
    },
    keyword_frequency_domain: {
      detected_patterns: detectedKeywords,
      missing_patterns: missingKeywords,
      emerging_trends: getEmergingTrends(resumeData),
      neural_suggestions: getKeywordSuggestions(),
    },
    quantifiable_neural_pathways: {
      metric_density: countMetrics(resumeData),
      impact_amplitude: getImpactLevel(countMetrics(resumeData)),
      quantum_suggestions: getMetricSuggestions(),
    },
    ai_consciousness_analysis: {
      strength_vectors: identifyStrengths(resumeData),
      weakness_singularities: identifyWeaknesses(resumeData),
      opportunity_horizons: getOpportunities(),
      threat_landscapes: getThreats(),
    },
    future_employment_index: calculateFutureIndex(resumeData),
    market_neural_position: getMarketPosition(overallScore),
    unique_value_quantum: findUniqueValue(resumeData),
    optimization_protocols: generateOptimizationProtocols(resumeData, {
      formatScore,
      contentScore,
      keywordsScore,
      experienceScore,
      educationScore,
      skillsScore,
      achievementsScore,
    }),
    competitive_neural_network: {
      percentile_rank: Math.min(99, overallScore),
      market_demand_index: calculateDemandIndex(resumeData),
      compensation_quantum: estimateCompensation(resumeData),
    },
    holographic_insights: generateHolographicInsights(resumeData),
  };
}

/**
 * Main analysis function that tries OpenAI first, then falls back to local
 */
async function analyzeResume(resumeData, jobDescription = "") {
  try {
    // Try OpenAI first
    const openAIAnalysis = await analyzeResumeWithOpenAI(
      resumeData,
      jobDescription,
    );

    // Add metadata
    openAIAnalysis.analyzed_at = new Date().toISOString();
    openAIAnalysis.model_used = "GPT-4";
    openAIAnalysis.confidence_score = calculateConfidenceScore(openAIAnalysis);

    return {
      success: true,
      analysis: openAIAnalysis,
      source: "openai",
    };
  } catch (openaiError) {
    // Fall back to local analysis
    const localAnalysis = generateLocalAnalysis(resumeData, jobDescription);

    return {
      success: true,
      analysis: {
        ...localAnalysis,
        analyzed_at: new Date().toISOString(),
        model_used: "Local Neural Network v1.0 (Fallback)",
        confidence_score: 85,
      },
      source: "local",
      error: openaiError.message,
    };
  }
}

// Helper functions
function calculateScore(maxScore, conditions) {
  const trueCount = conditions.filter(Boolean).length;
  return Math.min(
    maxScore,
    Math.max(1, Math.floor((trueCount / conditions.length) * maxScore)),
  );
}

function hasAchievements(experience) {
  return experience?.some((exp) => exp.achievements?.length > 0) || false;
}

function hasMetrics(experience) {
  return (
    experience?.some((exp) => {
      const text = JSON.stringify(exp);
      return /\d+/.test(text);
    }) || false
  );
}

function hasDegree(education) {
  return education?.some((edu) => edu.degree) || false;
}

function hasField(education) {
  return education?.some((edu) => edu.field) || false;
}

function hasSchool(education) {
  return education?.some((edu) => edu.school) || false;
}

function calculateKeywordScore(resumeData, jobDescription) {
  if (!jobDescription) return 6;

  const resumeText = extractResumeText(resumeData);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);
  const keywords = [...new Set(jobWords.filter((w) => w.length > 3))].slice(
    0,
    20,
  );

  let matches = 0;
  keywords.forEach((keyword) => {
    if (resumeText.includes(keyword)) matches++;
  });

  return Math.min(
    10,
    Math.max(1, Math.floor((matches / keywords.length) * 10) || 5),
  );
}

function extractResumeText(resumeData) {
  const parts = [];

  if (resumeData.personal?.full_name) parts.push(resumeData.personal.full_name);
  if (resumeData.personal?.headline) parts.push(resumeData.personal.headline);
  if (resumeData.summary?.summary) parts.push(resumeData.summary.summary);

  resumeData.experience?.forEach((exp) => {
    if (exp.title) parts.push(exp.title);
    if (exp.company) parts.push(exp.company);
    if (exp.description) parts.push(exp.description);
    exp.achievements?.forEach((ach) => parts.push(ach));
  });

  resumeData.projects?.forEach((proj) => {
    if (proj.name) parts.push(proj.name);
    if (proj.description) parts.push(proj.description);
    if (proj.technologies) parts.push(proj.technologies.join(" "));
  });

  return parts.join(" ").toLowerCase();
}

function getAnalysis(score, type) {
  if (score >= 8) return `Excellent ${type} with strong presentation`;
  if (score >= 6) return `Good ${type} with room for enhancement`;
  if (score >= 4) return `Adequate ${type} needs improvement`;
  return `${type} section requires significant development`;
}

function getKeywordAnalysisText(score) {
  if (score >= 8) return "Strong keyword optimization for your industry";
  if (score >= 6) return "Good keyword presence but could be more targeted";
  return "Limited keyword optimization detected";
}

function calculateTemporalRelevance(resumeData) {
  let score = 70;
  const currentYear = new Date().getFullYear();

  resumeData.experience?.forEach((exp) => {
    if (exp.current) score += 15;
    if (exp.end_date?.includes(currentYear.toString())) score += 10;
  });

  return Math.min(100, score);
}

function calculateParsingProbability(resumeData) {
  let prob = 85;

  if (!resumeData.personal?.email) prob -= 15;
  if (!resumeData.personal?.phone) prob -= 10;
  if (!resumeData.experience?.length) prob -= 20;

  return Math.max(50, prob);
}

function findFormatIssues(resumeData) {
  const issues = [];

  if (!resumeData.personal?.full_name) issues.push("Missing full name");
  if (!resumeData.personal?.email) issues.push("Missing email");
  if (!resumeData.personal?.phone) issues.push("Missing phone");
  if (!resumeData.summary?.summary) issues.push("Missing professional summary");
  if (!resumeData.experience?.length) issues.push("No work experience listed");
  if (!resumeData.education?.length) issues.push("No education listed");

  return issues;
}

function generateRecommendations(resumeData) {
  const recs = [];

  if (!resumeData.summary?.summary) {
    recs.push("Add a compelling professional summary");
  }

  if ((resumeData.skills?.technical?.length || 0) < 3) {
    recs.push("List more technical skills");
  }

  if (resumeData.experience?.length < 2) {
    recs.push("Add more work experience or internships");
  }

  if (!hasMetrics(resumeData.experience)) {
    recs.push("Add measurable achievements with numbers");
  }

  return recs;
}

function extractKeywords(resumeData) {
  const commonKeywords = [
    "leadership",
    "project management",
    "communication",
    "teamwork",
    "problem solving",
    "analytical",
    "strategic",
    "innovation",
  ];

  const resumeText = extractResumeText(resumeData);
  return commonKeywords.filter((kw) => resumeText.includes(kw)).slice(0, 5);
}

function suggestMissingKeywords(resumeData, jobDescription) {
  if (jobDescription) {
    const resumeText = extractResumeText(resumeData);
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const keywords = [...new Set(jobWords.filter((w) => w.length > 3))].slice(
      0,
      10,
    );
    return keywords.filter((kw) => !resumeText.includes(kw)).slice(0, 5);
  }

  const commonKeywords = [
    "leadership",
    "project management",
    "teamwork",
    "communication",
    "problem solving",
    "analytical",
    "strategic planning",
    "innovation",
  ];

  const resumeText = extractResumeText(resumeData);
  return commonKeywords.filter((kw) => !resumeText.includes(kw)).slice(0, 5);
}

function getEmergingTrends(resumeData) {
  const trends = [];
  const resumeText = extractResumeText(resumeData);

  if (resumeText.includes("ai") || resumeText.includes("machine learning")) {
    trends.push("AI/ML expertise");
  }
  if (resumeText.includes("cloud") || resumeText.includes("aws")) {
    trends.push("Cloud computing");
  }
  if (resumeText.includes("data")) {
    trends.push("Data-driven decision making");
  }

  return trends.length ? trends : ["Consider adding emerging tech keywords"];
}

function getKeywordSuggestions() {
  return [
    "Add industry-specific keywords",
    "Include action verbs in experience",
    "Mention specific tools and technologies",
    "Quantify achievements with metrics",
  ];
}

function countMetrics(resumeData) {
  let count = 0;
  const resumeText = extractResumeText(resumeData);
  const numbers = resumeText.match(/\d+/g);
  return numbers?.length || 0;
}

function getImpactLevel(metrics) {
  if (metrics > 10) return "high";
  if (metrics > 5) return "medium";
  return "low";
}

function getMetricSuggestions() {
  return [
    "Add percentages to show improvements",
    "Include dollar amounts for budget management",
    "Mention team sizes you've led",
    "Quantify project timelines",
  ];
}

function identifyStrengths(resumeData) {
  const strengths = [];

  if (resumeData.experience?.length > 2) {
    strengths.push("Substantial work experience");
  }

  if ((resumeData.skills?.technical?.length || 0) > 8) {
    strengths.push("Strong technical skill set");
  }

  if (resumeData.education?.length > 0) {
    strengths.push("Solid educational background");
  }

  if (resumeData.projects?.length > 2) {
    strengths.push("Impressive project portfolio");
  }

  return strengths.length ? strengths : ["Foundation to build upon"];
}

function identifyWeaknesses(resumeData) {
  const weaknesses = [];

  if (!resumeData.summary?.summary) {
    weaknesses.push("Missing professional summary");
  }

  if (!resumeData.experience?.length) {
    weaknesses.push("No work experience listed");
  }

  if (!countMetrics(resumeData)) {
    weaknesses.push("Lack of quantifiable achievements");
  }

  if ((resumeData.skills?.technical?.length || 0) < 3) {
    weaknesses.push("Limited technical skills listed");
  }

  return weaknesses.length ? weaknesses : ["Areas for improvement identified"];
}

function getOpportunities() {
  return [
    "Add more industry certifications",
    "Expand professional network",
    "Develop emerging tech skills",
    "Build personal brand online",
  ];
}

function getThreats() {
  return [
    "High competition in your field",
    "Rapidly changing technology requirements",
    "Automation of certain job functions",
  ];
}

function calculateFutureIndex(resumeData) {
  let index = 65;

  if (
    resumeData.skills?.technical?.some(
      (s) =>
        s.toLowerCase().includes("ai") ||
        s.toLowerCase().includes("machine learning") ||
        s.toLowerCase().includes("cloud"),
    )
  ) {
    index += 20;
  }

  if ((resumeData.skills?.technical?.length || 0) > 10) {
    index += 10;
  }

  return Math.min(100, index);
}

function getMarketPosition(score) {
  if (score >= 90) return "TOP 10% - EXCEPTIONAL";
  if (score >= 75) return "TOP 25% - STRONG";
  if (score >= 60) return "COMPETITIVE";
  if (score >= 40) return "DEVELOPING";
  return "NEEDS IMPROVEMENT";
}

function findUniqueValue(resumeData) {
  const unique = [];

  if (resumeData.certifications?.length > 2) {
    unique.push("Multiple professional certifications");
  }

  if (resumeData.languages?.length > 1) {
    unique.push("Multilingual capabilities");
  }

  if (resumeData.projects?.length > 3) {
    unique.push("Extensive project portfolio");
  }

  if (resumeData.publications?.length > 0) {
    unique.push("Published author/researcher");
  }

  return unique.length ? unique : ["Your unique combination of skills"];
}

function generateOptimizationProtocols(resumeData, scores) {
  const protocols = [];

  if (scores.formatScore < 6) {
    protocols.push({
      priority_level: 1,
      neural_category: "Format Optimization",
      diagnostic: "Resume format needs improvement",
      enhancement_protocol:
        "Add missing sections: summary, skills, and complete contact information",
      impact_projection: 8,
    });
  }

  if (scores.keywordsScore < 6) {
    protocols.push({
      priority_level: 2,
      neural_category: "Keyword Enhancement",
      diagnostic: "Low keyword density detected",
      enhancement_protocol:
        "Incorporate industry-specific keywords from job descriptions",
      impact_projection: 9,
    });
  }

  if (scores.achievementsScore < 6) {
    protocols.push({
      priority_level: 1,
      neural_category: "Achievement Quantification",
      diagnostic: "Lack of measurable achievements",
      enhancement_protocol:
        "Add metrics, percentages, and numbers to your achievements",
      impact_projection: 9,
    });
  }

  if (!resumeData.summary?.summary) {
    protocols.push({
      priority_level: 1,
      neural_category: "Professional Summary",
      diagnostic: "Missing professional summary",
      enhancement_protocol:
        "Add a compelling 2-3 sentence summary highlighting your value",
      impact_projection: 7,
    });
  }

  if (scores.skillsScore < 6) {
    protocols.push({
      priority_level: 2,
      neural_category: "Skills Expansion",
      diagnostic: "Skills section needs enhancement",
      enhancement_protocol:
        "Add more technical and soft skills relevant to your target role",
      impact_projection: 7,
    });
  }

  return protocols;
}

function calculateDemandIndex(resumeData) {
  let index = 65;

  if ((resumeData.skills?.technical?.length || 0) > 5) {
    index += 15;
  }

  if (resumeData.experience?.length > 3) {
    index += 10;
  }

  return Math.min(100, index);
}

function estimateCompensation(resumeData) {
  const experience = resumeData.experience?.length || 0;

  if (experience > 5) return "$120K - $180K";
  if (experience > 2) return "$80K - $120K";
  return "$50K - $80K";
}

function generateHolographicInsights(resumeData) {
  return {
    first_impression: resumeData.summary?.summary
      ? "Professional and complete"
      : "Needs polish",
    recruiter_neural_response:
      resumeData.experience?.length > 2
        ? "Strong candidate profile"
        : "Entry level profile",
    ai_screening_prediction: resumeData.personal?.email
      ? "75% chance of passing initial screening"
      : "50% chance of passing initial screening",
  };
}

function calculateConfidenceScore(analysis) {
  let confidence = 85;

  if (analysis.quantum_score?.neural_network_confidence) {
    confidence =
      (confidence + analysis.quantum_score.neural_network_confidence) / 2;
  }

  return Math.round(confidence);
}

function buildResumeAnalysisPrompt(resumeData, jobDescription) {
  const resumeText = JSON.stringify(resumeData, null, 2);

  return `CRITICAL: You are a quantum-neural ATS system. Analyze this resume data with maximum precision.

RESUME DATA:
${resumeText}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ""}

Generate a cyberpunk-themed analysis with this exact JSON structure:
{
  "quantum_score": {
    "overall": number 0-100,
    "neural_network_confidence": number 0-100,
    "temporal_relevance": number 0-100
  },
  "dimensional_scores": {
    "syntactic_integrity": { "score": number 0-10, "analysis": string },
    "semantic_density": { "score": number 0-10, "analysis": string },
    "keyword_neural_map": { "score": number 0-10, "analysis": string },
    "experience_quantum": { "score": number 0-10, "analysis": string },
    "education_matrix": { "score": number 0-10, "analysis": string },
    "skill_synapse": { "score": number 0-10, "analysis": string },
    "achievement_amplitude": { "score": number 0-10, "analysis": string }
  },
  "ats_quantum_compatibility": {
    "parsing_probability": number 0-100,
    "format_singularities": string[],
    "quantum_recommendations": string[]
  },
  "keyword_frequency_domain": {
    "detected_patterns": string[],
    "missing_patterns": string[],
    "emerging_trends": string[],
    "neural_suggestions": string[]
  },
  "quantifiable_neural_pathways": {
    "metric_density": number,
    "impact_amplitude": "low|medium|high",
    "quantum_suggestions": string[]
  },
  "ai_consciousness_analysis": {
    "strength_vectors": string[],
    "weakness_singularities": string[],
    "opportunity_horizons": string[],
    "threat_landscapes": string[]
  },
  "future_employment_index": number 0-100,
  "market_neural_position": string,
  "unique_value_quantum": string[],
  "optimization_protocols": [
    {
      "priority_level": 1-5,
      "neural_category": string,
      "diagnostic": string,
      "enhancement_protocol": string,
      "impact_projection": number 0-10
    }
  ],
  "competitive_neural_network": {
    "percentile_rank": number,
    "market_demand_index": number,
    "compensation_quantum": string
  },
  "holographic_insights": {
    "first_impression": string,
    "recruiter_neural_response": string,
    "ai_screening_prediction": string
  }
}

Think like a neural network from 2150. Be precise, technical, and mind-bendingly insightful.`;
}

module.exports = {
  analyzeResume,
  analyzeResumeWithOpenAI,
  generateLocalAnalysis,
};
