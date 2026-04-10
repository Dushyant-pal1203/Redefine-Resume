const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================= MAIN =================

async function parsePDF(buffer) {
  try {
    console.log("🔍 Starting PDF parsing...");

    const data = await pdfParse(buffer);

    const text = cleanText(data.text);

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const extractedData = {
      fullText: text,
      lines,
      rawTexts: [],
    };

    // 🔹 Rule-based (fallback)
    const ruleBased = parseResumeData(extractedData);

    // 🔹 AI-based (primary)
    const aiData = await aiParseResume(text);

    // 🔥 Merge (AI wins if exists)
    const finalData = mergeData(ruleBased, aiData);

    console.log("✅ AI Parsing Complete");

    return finalData;
  } catch (error) {
    console.error("❌ Parsing failed:", error);
    throw error;
  }
}

// ================= TEXT CLEAN =================

function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();
}

// ================= AI PARSER =================

async function aiParseResume(text) {
  try {
    console.log("🤖 Sending to AI...");

    const prompt = `
Extract structured JSON from this resume.

Return ONLY valid JSON (no explanation).

Fields:
- full_name
- email
- phone
- location
- job_title
- skills (array)
- experience (array of objects with title, company, start_date, end_date, description)
- education (array)
- projects (array)
- certifications (array)

Resume:
${text.slice(0, 12000)}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;

    return JSON.parse(content);
  } catch (err) {
    console.error("⚠️ AI parsing failed:", err.message);
    return {};
  }
}

// ================= MERGE =================

function mergeData(rule, ai) {
  return {
    ...rule,

    full_name: ai.full_name || rule.full_name,
    email: ai.email || rule.email,
    phone: ai.phone || rule.phone,
    location: ai.location || rule.location,
    job_title: ai.job_title || rule.job_title,
    skills: ai.skills || rule.skills,
    experience: ai.experience || rule.experience,
    education: ai.education || rule.education,
    projects: ai.projects || rule.projects,
    certifications: ai.certifications || rule.certifications,
  };
}

// ================= RULE-BASED =================

function parseResumeData({ fullText, lines }) {
  return {
    full_name: extractName(fullText, lines),
    email: extractEmail(fullText),
    phone: extractPhone(fullText),
    location: extractLocation(fullText),
    job_title: extractJobTitle(fullText),
    skills: extractSkills(fullText),
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };
}

// ================= BASIC EXTRACTORS =================

function extractName(fullText, lines) {
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    if (/^[A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2}$/.test(line)) {
      return line;
    }
  }
  return "";
}

function extractEmail(text) {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return m ? m[0] : "";
}

function extractPhone(text) {
  const m = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  return m ? m[0].replace(/\D/g, "") : "";
}

function extractLocation(text) {
  const m = text.match(/(Delhi|Mumbai|Bangalore|India|Noida)/i);
  return m ? m[0] : "";
}

function extractJobTitle(text) {
  const m = text.match(
    /(Full Stack Developer|Software Engineer|Web Developer)/i,
  );
  return m ? m[0] : "";
}

function extractSkills(text) {
  const skills = ["javascript", "react", "node", "mongodb", "next"];
  const lower = text.toLowerCase();
  return skills.filter((s) => lower.includes(s));
}

// ================= EXPORT =================

module.exports = { parsePDF };
