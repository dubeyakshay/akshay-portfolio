import type { SiteContent } from "./types";

/**
 * Job-description analysis: compares a pasted JD against the portfolio
 * draft and reports which of the JD's keywords you already cover and
 * which are missing. Suggestions only — nothing is ever auto-added,
 * so the portfolio never claims skills you don't have.
 */

export type JdAnalysis = {
  engine: "ai" | "rules";
  matched: string[]; // JD keywords present in your portfolio
  missing: string[]; // JD keywords absent from your portfolio
  emphasize: string[]; // skills you have that the JD values most
  notes: string[];
};

const JD_VOCAB = [
  "C#", ".NET", "Java", "Python", "JavaScript", "TypeScript",
  "Playwright", "Selenium", "Cypress", "Appium", "WebdriverIO",
  "NUnit", "xUnit", "MSTest", "JUnit", "TestNG", "SpecFlow", "Cucumber",
  "API Testing", "REST", "RestSharp", "Postman", "GraphQL",
  "SQL", "MySQL", "PostgreSQL", "SQL Server", "MongoDB",
  "Azure DevOps", "Jenkins", "GitHub Actions", "GitLab CI", "TeamCity",
  "CI/CD", "Docker", "Kubernetes", "Git", "JIRA", "TestRail",
  "Page Object Model", "BDD", "TDD", "Agile", "Scrum",
  "JMeter", "K6", "LoadRunner", "Performance Testing", "Load Testing",
  "Automation Framework", "Test Automation", "Regression Testing",
  "Mobile Testing", "Cross-browser", "Parallel Execution", "Accessibility",
];

function portfolioSkillSet(content: SiteContent): Set<string> {
  const all = new Set<string>();
  content.profile.heroTech.forEach((s) => all.add(s.toLowerCase()));
  content.skills.groups.forEach((g) => g.items.forEach((s) => all.add(s.toLowerCase())));
  content.experience.forEach((e) => e.technologies.forEach((s) => all.add(s.toLowerCase())));
  content.projects.forEach((p) => p.technologies.forEach((s) => all.add(s.toLowerCase())));
  return all;
}

export function analyzeJdWithRules(jd: string, content: SiteContent): JdAnalysis {
  const have = portfolioSkillSet(content);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const term of JD_VOCAB) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<![A-Za-z0-9#.])${escaped}(?![A-Za-z0-9#])`, "i");
    if (!re.test(jd)) continue;
    if (have.has(term.toLowerCase())) matched.push(term);
    else missing.push(term);
  }

  return {
    engine: "rules",
    matched,
    missing,
    emphasize: matched.slice(0, 8),
    notes: [
      "Keyword scan only — read the JD for context.",
      "Never add skills you don't actually have; use 'missing' as a learning list or interview-prep pointer.",
    ],
  };
}

const JD_AI_PROMPT = `You are a career advisor for a QA Automation Engineer. Compare the JOB DESCRIPTION with the CANDIDATE SKILLS list.
Respond with ONLY valid JSON (no markdown fences):
{
  "matched": string[],    // JD requirements the candidate covers
  "missing": string[],    // JD requirements the candidate does not list — do NOT suggest faking them
  "emphasize": string[],  // candidate skills to feature most prominently for this JD, max 8
  "notes": string[]       // 2-4 short, honest, actionable observations
}
`;

export async function analyzeJdWithAI(jd: string, content: SiteContent): Promise<JdAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const skills = Array.from(portfolioSkillSet(content)).join(", ");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${JD_AI_PROMPT}\nCANDIDATE SKILLS: ${skills}\n\nJOB DESCRIPTION:\n${jd.slice(0, 15000)}`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned no content");
  const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
  return { engine: "ai", matched: [], missing: [], emphasize: [], notes: [], ...parsed };
}

export async function analyzeJd(jd: string, content: SiteContent): Promise<JdAnalysis> {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await analyzeJdWithAI(jd, content);
    } catch {
      const fallback = analyzeJdWithRules(jd, content);
      fallback.notes.unshift("AI analysis failed — used keyword scan fallback.");
      return fallback;
    }
  }
  return analyzeJdWithRules(jd, content);
}
