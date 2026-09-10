import type { SiteContent, ExperienceEntry } from "./types";

/**
 * Resume auto-import.
 *
 * Two engines:
 *  - AI (Gemini) when GEMINI_API_KEY is set — high-quality field mapping.
 *  - Rule-based fallback — regex/heuristics, no external calls.
 *
 * Both return a ParsedResume of *suggestions*. Nothing is applied to the
 * draft automatically; the admin reviews and applies field-by-field.
 */

export type ParsedResume = {
  engine: "ai" | "rules";
  name?: string;
  title?: string;
  intro?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  skills?: string[];
  experience?: Array<{
    company?: string;
    role?: string;
    start?: string;
    end?: string;
    location?: string;
    summary?: string;
    responsibilities?: string[];
    technologies?: string[];
  }>;
  certifications?: Array<{ name?: string; issuer?: string; year?: string }>;
  warnings: string[];
};

// ---------------------------------------------------------------- text extraction

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return (result.text ?? "").replace(/\r/g, "");
  } finally {
    await parser.destroy().catch(() => {});
  }
}

// ---------------------------------------------------------------- rule-based engine

const KNOWN_SKILLS = [
  "C#", ".NET", "ASP.NET", "Java", "Python", "JavaScript", "TypeScript",
  "Playwright", "Selenium", "Cypress", "Appium", "WebdriverIO", "Puppeteer",
  "NUnit", "xUnit", "MSTest", "JUnit", "TestNG", "SpecFlow", "Cucumber", "Reqnroll",
  "API Testing", "REST", "RestSharp", "Postman", "SoapUI", "GraphQL", "Swagger",
  "SQL", "MySQL", "PostgreSQL", "SQL Server", "Oracle", "MongoDB",
  "Azure DevOps", "Jenkins", "GitHub Actions", "GitLab CI", "TeamCity", "Bamboo",
  "CI/CD", "Docker", "Kubernetes", "Git", "JIRA", "TestRail", "Zephyr", "qTest",
  "Page Object Model", "BDD", "TDD", "Agile", "Scrum", "JMeter", "K6", "LoadRunner",
];

const SECTION_HEADERS =
  /^\s*(work experience|professional experience|experience|employment history|career history|work history)\s*:?\s*$/i;
const SECTION_END =
  /^\s*(education|certifications?|skills|technical skills|projects|awards|languages|interests|summary|profile|references)\s*:?\s*$/i;
const DATE_RANGE =
  /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—to]+\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current|till date|now)/i;

export function parseWithRules(text: string): ParsedResume {
  const warnings: string[] = [];
  const lines = text.split("\n").map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);

  const result: ParsedResume = { engine: "rules", warnings };

  // --- contact details
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
  if (email) result.email = email;

  const phone = text.match(/(?:\+\d{1,3}[\s-]?)?(?:\(?\d{3,5}\)?[\s-]?)?\d{3,5}[\s-]?\d{4,6}/)?.[0]?.trim();
  if (phone && phone.replace(/\D/g, "").length >= 10) result.phone = phone;

  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/i)?.[0];
  if (linkedin) result.linkedin = linkedin.startsWith("http") ? linkedin : `https://${linkedin}`;

  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+\/?/i)?.[0];
  if (github) result.github = github.startsWith("http") ? github : `https://${github}`;

  // --- name: first short line that isn't contact info / a header
  for (const line of nonEmpty.slice(0, 6)) {
    if (
      line.length >= 3 &&
      line.length <= 50 &&
      !/[@\d/:]/.test(line) &&
      !SECTION_END.test(line) &&
      line.split(/\s+/).length <= 5
    ) {
      result.name = line.replace(/\s+/g, " ");
      break;
    }
  }
  if (!result.name) warnings.push("Could not confidently detect a name — set it manually.");

  // --- title: line containing a QA/engineer keyword near the top
  const titleLine = nonEmpty
    .slice(0, 10)
    .find((l) => l !== result.name && /\b(engineer|tester|qa|sdet|quality|lead|architect|analyst)\b/i.test(l) && l.length <= 80);
  if (titleLine) result.title = titleLine;

  // --- skills: match against known vocabulary (whole-word, case-insensitive)
  const found = new Set<string>();
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<![A-Za-z0-9#.])${escaped}(?![A-Za-z0-9#])`, "i");
    if (re.test(text)) found.add(skill);
  }
  if (found.size) result.skills = Array.from(found);

  // --- experience section
  const expStart = lines.findIndex((l) => SECTION_HEADERS.test(l));
  if (expStart >= 0) {
    let expEnd = lines.length;
    for (let i = expStart + 1; i < lines.length; i++) {
      if (SECTION_END.test(lines[i])) {
        expEnd = i;
        break;
      }
    }
    const expLines = lines.slice(expStart + 1, expEnd);
    const entries: NonNullable<ParsedResume["experience"]> = [];
    let current: (typeof entries)[number] | null = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      if (!line) continue;
      const dates = line.match(DATE_RANGE);
      if (dates) {
        // A date range signals a new role. Company/role usually on this or nearby lines.
        const context = [expLines[i - 2], expLines[i - 1], line.replace(DATE_RANGE, "").trim()]
          .filter(Boolean)
          .filter((l) => !DATE_RANGE.test(l ?? "") || l === line);
        if (current) entries.push(current);
        current = {
          start: dates[1],
          end: dates[2],
          responsibilities: [],
        };
        const texts = (context as string[])
          .map((c) => c.replace(/[|•·]—?/g, " ").trim())
          .filter((c) => c.length > 2 && c.length < 90);
        if (texts.length >= 2) {
          current.role = texts[0];
          current.company = texts[1];
        } else if (texts.length === 1) {
          current.role = texts[0];
        }
      } else if (current && /^[-•·*▪◦]/.test(line)) {
        current.responsibilities!.push(line.replace(/^[-•·*▪◦]\s*/, ""));
      }
    }
    if (current) entries.push(current);
    if (entries.length) {
      result.experience = entries.slice(0, 10);
    } else {
      warnings.push("An experience section was found but individual roles could not be split — add them manually.");
    }
  } else {
    warnings.push("No experience section header detected.");
  }

  // --- certifications
  const certStart = lines.findIndex((l) => /^\s*certifications?\s*:?\s*$/i.test(l));
  if (certStart >= 0) {
    const certs: NonNullable<ParsedResume["certifications"]> = [];
    for (let i = certStart + 1; i < Math.min(certStart + 12, lines.length); i++) {
      const line = lines[i];
      if (!line) continue;
      if (SECTION_END.test(line) || SECTION_HEADERS.test(line)) break;
      const year = line.match(/(19|20)\d{2}/)?.[0];
      certs.push({ name: line.replace(/^[-•·*▪◦]\s*/, ""), year });
    }
    if (certs.length) result.certifications = certs;
  }

  warnings.push(
    "Rule-based extraction is approximate — review every field before applying. For higher accuracy, add a GEMINI_API_KEY."
  );
  return result;
}

// ---------------------------------------------------------------- AI engine (Gemini)

const AI_SCHEMA_PROMPT = `You are a resume parser. Extract structured data from the resume text below.
Respond with ONLY valid JSON (no markdown fences) matching exactly this TypeScript shape; omit fields you cannot find; never invent data:
{
  "name": string,
  "title": string,
  "intro": string,            // 2-3 sentence first-person professional summary based ONLY on resume content
  "email": string,
  "phone": string,
  "linkedin": string,         // full URL
  "github": string,           // full URL
  "location": string,
  "skills": string[],         // technical skills/tools only
  "experience": [{
    "company": string,
    "role": string,
    "start": string,          // e.g. "Mar 2019"
    "end": string,            // e.g. "Present"
    "location": string,
    "summary": string,        // 1-2 sentences
    "responsibilities": string[],
    "technologies": string[]
  }],
  "certifications": [{ "name": string, "issuer": string, "year": string }]
}

RESUME TEXT:
`;

export async function parseWithAI(text: string): Promise<ParsedResume> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: AI_SCHEMA_PROMPT + text.slice(0, 30000) }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned no content");

  let parsed: Omit<ParsedResume, "engine" | "warnings">;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  return { ...parsed, engine: "ai", warnings: [] };
}

export async function parseResume(text: string): Promise<ParsedResume> {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await parseWithAI(text);
    } catch (e) {
      const fallback = parseWithRules(text);
      fallback.warnings.unshift(
        `AI parsing failed (${e instanceof Error ? e.message : "unknown"}) — used rule-based fallback.`
      );
      return fallback;
    }
  }
  return parseWithRules(text);
}

// ---------------------------------------------------------------- apply to draft

/** Merge parsed suggestions into a draft. Only fields the admin selected. */
export function applyParsedToDraft(
  draft: SiteContent,
  parsed: ParsedResume,
  selections: {
    profile?: boolean;
    contact?: boolean;
    skills?: boolean;
    experience?: boolean;
    certifications?: boolean;
  }
): SiteContent {
  const next = structuredClone(draft);

  if (selections.profile) {
    if (parsed.name) next.profile.name = parsed.name;
    if (parsed.title) next.profile.title = parsed.title;
    if (parsed.intro) next.profile.intro = parsed.intro;
    if (parsed.location) next.profile.location = parsed.location;
  }
  if (selections.contact) {
    if (parsed.email) next.contact.email = parsed.email;
    if (parsed.phone) next.contact.phone = parsed.phone;
    if (parsed.linkedin) next.contact.linkedin = parsed.linkedin;
    if (parsed.github) next.contact.github = parsed.github;
  }
  if (selections.skills && parsed.skills?.length) {
    next.profile.heroTech = parsed.skills.slice(0, 10);
  }
  if (selections.experience && parsed.experience?.length) {
    const entries: ExperienceEntry[] = parsed.experience.map((e) => ({
      id: crypto.randomUUID(),
      company: e.company ?? "",
      role: e.role ?? "",
      start: e.start ?? "",
      end: e.end ?? "",
      location: e.location ?? "",
      summary: e.summary ?? "",
      responsibilities: e.responsibilities ?? [],
      technologies: e.technologies ?? [],
      achievements: [],
    }));
    next.experience = entries;
  }
  if (selections.certifications && parsed.certifications?.length) {
    next.certifications = parsed.certifications.map((c) => ({
      id: crypto.randomUUID(),
      name: c.name ?? "",
      issuer: c.issuer ?? "",
      year: c.year ?? "",
      url: "",
    }));
  }
  return next;
}
