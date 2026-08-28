import type { SiteContent } from "./types";

/**
 * Default content — honest placeholders only.
 * Everything here is editable from /admin without touching code.
 * No invented companies, dates, metrics, certifications or URLs.
 */
export const defaultContent: SiteContent = {
  profile: {
    name: "Your Name",
    title: "QA Automation Engineer",
    experienceBadge: "11+ Years of Experience",
    tagline: "Senior • Technical • Reliable • Automation Expert",
    intro:
      "I design and build test automation that engineering teams can trust — scalable C# frameworks, reliable UI and API coverage, and CI/CD pipelines that turn quality into a fast, repeatable signal instead of a bottleneck.",
    heroTech: [
      "C#",
      "Playwright",
      "Selenium",
      "NUnit",
      "API Testing",
      "SQL",
      "Azure DevOps",
      "CI/CD",
    ],
    location: "",
    availability: "",
    profileImageUrl: "",
    resumeUrl: "/resume.pdf",
  },

  snapshot: {
    heading: "Recruiter Snapshot",
    items: [
      { id: "s1", title: "11+ Years", subtitle: "Software testing experience across the full QA lifecycle" },
      { id: "s2", title: "C# Automation", subtitle: "Strongly-typed, maintainable automation in C# / .NET" },
      { id: "s3", title: "Playwright + Selenium", subtitle: "Modern and battle-tested UI automation stacks" },
      { id: "s4", title: "UI + API Testing", subtitle: "End-to-end coverage across interface and service layers" },
      { id: "s5", title: "Framework Architecture", subtitle: "Page objects, layered design, reusable core libraries" },
      { id: "s6", title: "CI/CD", subtitle: "Automation wired into Azure DevOps pipelines" },
    ],
  },

  about: {
    heading: "About",
    paragraphs: [
      "I am a QA Automation Engineer with more than eleven years in software testing. My focus is building automation that lasts: frameworks with clear layers, tests that read like specifications, and infrastructure that keeps suites fast and deterministic as they grow.",
      "I work across the stack — driving browsers with Playwright and Selenium, exercising services through API tests, and validating data directly in SQL — and I treat the automation codebase with the same engineering discipline as production code: separation of concerns, code review, and continuous refactoring.",
      "In CI/CD, my goal is fast, trustworthy feedback. I design suites for parallel execution, isolate test data so runs never collide, and make failures diagnosable in minutes through structured logging and reporting.",
    ],
    focusAreas: [
      "Automation framework development",
      "Scalable & maintainable automation",
      "UI / API testing",
      "Test architecture",
      "Parallel execution",
      "CI/CD integration",
      "Quality engineering",
    ],
  },

  skills: {
    heading: "Technical Expertise",
    groups: [
      {
        id: "g1",
        title: "Programming",
        subtitle: "Typed, maintainable automation code",
        items: ["C#", ".NET"],
        size: "lg",
      },
      {
        id: "g2",
        title: "UI Automation",
        subtitle: "Cross-browser end-to-end testing",
        items: ["Playwright", "Selenium"],
        size: "md",
      },
      {
        id: "g3",
        title: "Testing",
        subtitle: "Unit-style structure for E2E suites",
        items: ["NUnit", "API Testing"],
        size: "md",
      },
      {
        id: "g4",
        title: "Architecture",
        subtitle: "Designs that scale with the team",
        items: ["Page Object Model", "Layered Architecture"],
        size: "lg",
      },
      {
        id: "g5",
        title: "CI/CD",
        subtitle: "Quality gates in every pipeline",
        items: ["Azure DevOps", "CI/CD Pipelines"],
        size: "md",
      },
      {
        id: "g6",
        title: "Database",
        subtitle: "Data-level validation & seeding",
        items: ["SQL"],
        size: "md",
      },
    ],
  },

  experience: [
    {
      id: "e1",
      company: "Company Name",
      role: "Senior QA Automation Engineer",
      start: "Start date",
      end: "Present",
      location: "Location",
      summary:
        "Edit this entry in the admin dashboard — describe your role, team and mission in one or two sentences.",
      responsibilities: [
        "Add your key responsibilities here",
        "One bullet per responsibility",
      ],
      technologies: ["C#", "Playwright", "NUnit", "Azure DevOps", "SQL"],
      achievements: ["Add real, verifiable achievements here"],
    },
    {
      id: "e2",
      company: "Previous Company",
      role: "QA Automation Engineer",
      start: "Start date",
      end: "End date",
      location: "Location",
      summary:
        "Placeholder entry — replace with your actual experience from the admin dashboard.",
      responsibilities: ["Add your responsibilities here"],
      technologies: ["C#", "Selenium", "NUnit", "SQL"],
      achievements: [],
    },
  ],

  projects: [
    {
      id: "p1",
      title: "Enterprise UI Automation Framework",
      subtitle: "C# • Playwright • NUnit",
      description:
        "A layered UI automation framework in C# designed for large regression suites: page objects, a reusable core library, configuration-driven environments and parallel-safe execution.",
      problem:
        "UI suites commonly rot — brittle selectors, duplicated logic and slow serial runs erode trust until teams stop reading results.",
      approach:
        "Strict layering: tests express intent only; step/flow classes compose actions; page objects own locators and interactions; an infrastructure layer handles browser lifecycle, waits, configuration, logging and reporting. Parallel execution is designed in from day one with isolated browser contexts and per-test data.",
      technologies: ["C#", ".NET", "Playwright", "NUnit", "Azure DevOps"],
      architecture:
        "Tests → Steps → Page Objects → Infrastructure (configuration, browser factory, reporting, logging).",
      outcome:
        "A maintainable framework pattern where new tests are additive — engineers add pages and flows without touching core plumbing.",
      imageUrl: "",
      githubUrl: "",
      demoUrl: "",
    },
    {
      id: "p2",
      title: "API + UI Test Automation",
      subtitle: "Hybrid strategy • C# • REST",
      description:
        "A hybrid test strategy that uses APIs for speed and setup, and the UI only for what users actually see — cutting run time while increasing coverage depth.",
      problem:
        "Testing everything through the UI is slow and fragile; testing only APIs misses rendering and workflow defects.",
      approach:
        "APIs create and manage test data and preconditions; UI tests validate the critical user-facing journeys; API assertions verify contracts, status codes and payloads; SQL checks confirm persisted state.",
      technologies: ["C#", "API Testing", "Playwright", "NUnit", "SQL"],
      architecture:
        "API (arrange) → Create Test Data → UI (act) → Validate (UI + API + database).",
      outcome:
        "Faster, more deterministic suites: each layer is tested where it is cheapest and most reliable to test.",
      imageUrl: "",
      githubUrl: "",
      demoUrl: "",
    },
    {
      id: "p3",
      title: "CI/CD Test Automation",
      subtitle: "Azure DevOps • Quality gates",
      description:
        "Test automation integrated into Azure DevOps pipelines so every commit produces a clear quality signal — build, test, report, pass/fail.",
      problem:
        "Automation that runs 'sometimes, on someone's machine' provides no engineering value. Quality feedback must be continuous and visible.",
      approach:
        "Pipelines trigger on commit: restore/build, run suites in parallel stages, publish structured test results and artifacts, and gate merges on pass/fail. Flaky tests are quarantined and tracked rather than ignored.",
      technologies: ["Azure DevOps", "CI/CD", "NUnit", "C#", "Playwright"],
      architecture: "Commit → Build → Tests (parallel) → Report → Pass/Fail gate.",
      outcome:
        "Quality becomes a pipeline stage, not a phase — regressions surface minutes after the commit that caused them.",
      imageUrl: "",
      githubUrl: "",
      demoUrl: "",
    },
    {
      id: "p4",
      title: "Automation Upskilling Project",
      subtitle: "Continuous learning • Modern tooling",
      description:
        "An ongoing personal project for deliberately practicing modern automation: migrating patterns to Playwright, refining framework design, and evaluating new tooling against real-world testing problems.",
      problem:
        "Eleven years in, the biggest risk is standing still. Tools change; the discipline of evaluating them honestly does not.",
      approach:
        "Rebuild known solutions with new stacks, compare trade-offs (speed, stability, developer experience), and fold the lessons back into production frameworks.",
      technologies: ["C#", "Playwright", ".NET", "CI/CD"],
      architecture: "Small focused repos — one concept, one experiment, one conclusion.",
      outcome:
        "A current, evidence-based toolkit and the judgment to know when a new tool is worth adopting.",
      imageUrl: "",
      githubUrl: "",
      demoUrl: "",
    },
  ],

  certifications: [],

  principles: [
    {
      id: "pr1",
      title: "Maintainability",
      description:
        "Automation is a codebase, not a script pile. Clear naming, small classes and ruthless de-duplication keep the cost of change low.",
    },
    {
      id: "pr2",
      title: "Reliability",
      description:
        "A test that fails randomly is worse than no test. Deterministic waits, isolated data and stable environments come before coverage counts.",
    },
    {
      id: "pr3",
      title: "Scalability",
      description:
        "Suites are designed for parallel execution from the first test — thread-safe drivers, independent data, no shared state.",
    },
    {
      id: "pr4",
      title: "Separation of Concerns",
      description:
        "Tests express intent. Pages own the UI. Infrastructure owns the plumbing. Each layer changes for exactly one reason.",
    },
    {
      id: "pr5",
      title: "Fast Feedback",
      description:
        "The value of a failing test decays by the hour. Automation belongs in the pipeline, reporting minutes after every commit.",
    },
  ],

  contact: {
    heading: "Contact",
    blurb:
      "Open to conversations about senior QA automation roles, framework architecture and quality engineering.",
    email: "",
    linkedin: "",
    github: "",
    phone: "",
  },

  seo: {
    title: "QA Automation Engineer — 11+ Years | C#, Playwright, Selenium",
    description:
      "Senior QA Automation Engineer with 11+ years of experience. C# automation frameworks, Playwright, Selenium, NUnit, API testing, SQL and Azure DevOps CI/CD.",
    keywords:
      "QA Automation Engineer, C#, Playwright, Selenium, NUnit, API Testing, Azure DevOps, CI/CD, Test Architecture",
    siteUrl: "",
  },

  sections: [
    { id: "snapshot", label: "Recruiter Snapshot", enabled: true },
    { id: "about", label: "About", enabled: true },
    { id: "skills", label: "Technical Expertise", enabled: true },
    { id: "architecture", label: "Automation Architecture", enabled: true },
    { id: "experience", label: "Experience", enabled: true },
    { id: "projects", label: "Projects", enabled: true },
    { id: "certifications", label: "Certifications", enabled: false },
    { id: "principles", label: "Engineering Principles", enabled: true },
    { id: "contact", label: "Contact", enabled: true },
  ],

  media: [],
};
