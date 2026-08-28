"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type TabId = "framework" | "dataflow" | "pipeline";

const TABS: { id: TabId; label: string; caption: string }[] = [
  {
    id: "framework",
    label: "Framework Layers",
    caption: "Tests → Steps → Page Objects → Infrastructure",
  },
  {
    id: "dataflow",
    label: "Hybrid Test Flow",
    caption: "API → Create Test Data → UI → Validate",
  },
  {
    id: "pipeline",
    label: "CI/CD Pipeline",
    caption: "Commit → Build → Tests → Report → Pass/Fail",
  },
];

const LAYERS = [
  {
    id: "tests",
    name: "Tests",
    tag: "[Test] · NUnit",
    color: "#8ab8ff",
    detail:
      "Pure intent. Each test reads like a specification — Arrange, Act, Assert — with zero knowledge of selectors, URLs or HTTP. If a test needs a comment to be understood, it gets refactored.",
    chips: ["NUnit", "Assertions", "Parallelizable", "Data-driven"],
  },
  {
    id: "steps",
    name: "Steps / Flows",
    tag: "Business language",
    color: "#7fa8f7",
    detail:
      "Reusable business flows composed from page actions: LoginAs(user), PlaceOrder(items), ApproveInvoice(id). One flow, used by many tests — change the journey once, every test follows.",
    chips: ["Composable", "Reusable", "Domain-focused"],
  },
  {
    id: "pages",
    name: "Page Objects",
    tag: "POM · locators & actions",
    color: "#6d97ea",
    detail:
      "Each page or component owns its locators and interactions. UI changes are absorbed here — a renamed button is a one-line fix, not a hundred failing tests.",
    chips: ["Playwright", "Selenium", "Encapsulation", "Component objects"],
  },
  {
    id: "infra",
    name: "Infrastructure",
    tag: "The engine room",
    color: "#5e96f5",
    detail:
      "Everything the layers above rely on but never see: environment configuration, browser lifecycle, API clients, database access, isolated test data, structured reporting and logging.",
    chips: [],
  },
];

const INFRA_MODULES = [
  { name: "Configuration", icon: "M8 5.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" },
  { name: "Browser", icon: "M2 3.5h12v9H2zM2 6h12M4 4.8h.01M5.5 4.8h.01" },
  { name: "API", icon: "M5.5 5L2.5 8l3 3M10.5 5l3 3-3 3" },
  { name: "Database", icon: "M8 2.2c2.9 0 5.2.8 5.2 1.9S10.9 6 8 6 2.8 5.2 2.8 4.1 5.1 2.2 8 2.2zM2.8 4.1v7.8c0 1.1 2.3 1.9 5.2 1.9s5.2-.8 5.2-1.9V4.1M2.8 8c0 1.1 2.3 1.9 5.2 1.9S13.2 9.1 13.2 8" },
  { name: "Test Data", icon: "M4.5 2h5L12.5 5v9h-8zM9.5 2v3h3M6 8.5h4M6 11h4" },
  { name: "Reporting", icon: "M2.5 13.5h11M4.5 13.5V8M8 13.5V4.5M11.5 13.5V6.5" },
  { name: "Logging", icon: "M3 3h10v10H3zM5.5 6h5M5.5 8.5h5M5.5 11h3" },
];

const DATAFLOW = [
  {
    id: "api",
    title: "API",
    sub: "Arrange via services",
    color: "#4fd1a5",
    detail:
      "Preconditions are created through API calls — accounts, products, orders — in seconds instead of minutes of UI clicking. Fast, deterministic, parallel-safe.",
  },
  {
    id: "data",
    title: "Create Test Data",
    sub: "Isolated per test",
    color: "#66c6c0",
    detail:
      "Every test gets its own uniquely identified data. No shared fixtures, no ordering dependencies, no collisions when hundreds of tests run in parallel.",
  },
  {
    id: "ui",
    title: "UI",
    sub: "Act like a user",
    color: "#7fa8f7",
    detail:
      "The browser is used only for what the browser is for: the user journey under test. Navigation, interaction, and the workflow the business cares about.",
  },
  {
    id: "validate",
    title: "Validate",
    sub: "UI + API + SQL",
    color: "#8ab8ff",
    detail:
      "Assertions at every layer that matters — what the user sees in the UI, what the API returns, and what actually landed in the database.",
  },
];

const PIPELINE = [
  {
    id: "commit",
    title: "Commit",
    sub: "Push / PR trigger",
    detail: "Every push and pull request triggers the pipeline automatically. Quality is not an opt-in step.",
  },
  {
    id: "build",
    title: "Build",
    sub: "Restore · compile",
    detail: "The automation solution compiles under the same rigor as product code — warnings-as-errors, analyzers, code review.",
  },
  {
    id: "tests",
    title: "Tests",
    sub: "Parallel stages",
    detail: "API and UI suites run in parallel stages across agents. Isolated data and thread-safe drivers keep runs deterministic.",
  },
  {
    id: "report",
    title: "Report",
    sub: "Results · artifacts",
    detail: "Structured results published to the pipeline: failures with logs, screenshots and traces attached — diagnosable in minutes.",
  },
  {
    id: "gate",
    title: "Pass / Fail",
    sub: "Quality gate",
    detail: "A red suite blocks the merge. Green means deployable — because the suite has earned the team's trust.",
  },
];

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  const rotate = direction === "down" ? "rotate-90" : "";
  return (
    <div className={`flex items-center justify-center text-ink-500 ${rotate}`} aria-hidden>
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <path
          d="M1 7h23"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-flow-dash"
        />
        <path d="M21 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Architecture() {
  const [tab, setTab] = useState<TabId>("framework");
  const [activeLayer, setActiveLayer] = useState("tests");
  const [activeFlow, setActiveFlow] = useState("api");
  const [activeStage, setActiveStage] = useState("tests");

  const layer = LAYERS.find((l) => l.id === activeLayer)!;
  const flow = DATAFLOW.find((f) => f.id === activeFlow)!;
  const stage = PIPELINE.find((s) => s.id === activeStage)!;
  const currentTab = TABS.find((t) => t.id === tab)!;

  return (
    <section id="architecture" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-3">Automation Architecture</p>
          <h2 className="heading-xl mb-4">
            How I structure automation
            <span className="text-ink-400"> that scales.</span>
          </h2>
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-ink-300">
            Explore the three views below — the framework&apos;s layered design, the hybrid
            API + UI test flow, and the CI/CD pipeline that turns it all into a continuous
            quality signal. Click any element for detail.
          </p>
        </Reveal>

        <Reveal delay={100}>
          {/* tab bar */}
          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-accent-500/15 text-accent-300 ring-1 ring-accent-400/40"
                    : "text-ink-400 hover:bg-white/[0.04] hover:text-ink-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="glass overflow-hidden rounded-2xl">
            {/* faux terminal header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
              </div>
              <span className="font-mono text-[11px] tracking-wide text-ink-500">
                {currentTab.caption}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1.25fr_1fr]">
              {/* ---------------- diagram column ---------------- */}
              <div>
                {tab === "framework" && (
                  <div className="space-y-2.5">
                    {LAYERS.map((l, i) => (
                      <div key={l.id}>
                        <button
                          onClick={() => setActiveLayer(l.id)}
                          className={`w-full rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                            activeLayer === l.id
                              ? "border-accent-400/50 bg-accent-500/[0.08] shadow-[0_0_28px_-8px_rgba(94,150,245,0.45)]"
                              : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                          }`}
                          style={{ marginInline: `${i * 4}px` }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: l.color }}
                                aria-hidden
                              />
                              <span className="text-[15px] font-semibold text-ink-100">
                                {l.name}
                              </span>
                            </div>
                            <span className="hidden font-mono text-[11px] text-ink-500 sm:block">
                              {l.tag}
                            </span>
                          </div>
                          {l.id === "infra" && (
                            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                              {INFRA_MODULES.map((m) => (
                                <span
                                  key={m.name}
                                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-base-900/60 px-2 py-1.5 font-mono text-[10.5px] text-ink-300"
                                >
                                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#8ab8ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <path d={m.icon} />
                                  </svg>
                                  {m.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                        {i < LAYERS.length - 1 && (
                          <div className="flex justify-center py-0.5">
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="text-ink-500" aria-hidden>
                              <path d="M7 1v10" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" className="animate-flow-dash" />
                              <path d="M3.5 9.5L7 13.5l3.5-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tab === "dataflow" && (
                  <div className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center">
                    {DATAFLOW.map((f, i) => (
                      <div key={f.id} className="flex flex-1 flex-col items-stretch gap-1 sm:flex-row sm:items-center">
                        <button
                          onClick={() => setActiveFlow(f.id)}
                          className={`flex-1 rounded-xl border p-4 text-left transition-all duration-300 ${
                            activeFlow === f.id
                              ? "border-accent-400/50 bg-accent-500/[0.08] shadow-[0_0_28px_-8px_rgba(94,150,245,0.45)]"
                              : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <span className="mb-2 block h-1.5 w-8 rounded-full" style={{ background: f.color }} aria-hidden />
                          <span className="block text-sm font-semibold text-ink-100">{f.title}</span>
                          <span className="mt-0.5 block text-[11.5px] text-ink-400">{f.sub}</span>
                        </button>
                        {i < DATAFLOW.length - 1 && (
                          <div className="hidden sm:block">
                            <Arrow />
                          </div>
                        )}
                        {i < DATAFLOW.length - 1 && (
                          <div className="flex justify-center sm:hidden">
                            <Arrow direction="down" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tab === "pipeline" && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    {PIPELINE.map((s, i) => (
                      <div key={s.id} className="flex flex-1 flex-col items-stretch gap-1 sm:flex-row sm:items-center">
                        <button
                          onClick={() => setActiveStage(s.id)}
                          className={`flex-1 rounded-xl border p-3.5 text-left transition-all duration-300 ${
                            activeStage === s.id
                              ? "border-accent-400/50 bg-accent-500/[0.08] shadow-[0_0_28px_-8px_rgba(94,150,245,0.45)]"
                              : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <span className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.06] font-mono text-[10px] text-accent-300">
                            {i + 1}
                          </span>
                          <span className="block text-[13px] font-semibold text-ink-100">
                            {s.title}
                          </span>
                          <span className="mt-0.5 block text-[10.5px] text-ink-400">{s.sub}</span>
                        </button>
                        {i < PIPELINE.length - 1 && (
                          <>
                            <div className="hidden sm:block">
                              <Arrow />
                            </div>
                            <div className="flex justify-center sm:hidden">
                              <Arrow direction="down" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ---------------- detail column ---------------- */}
              <aside className="rounded-xl border border-white/[0.07] bg-base-900/50 p-5">
                {tab === "framework" && (
                  <div key={layer.id} className="animate-fade-in">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: layer.color }} aria-hidden />
                      <h3 className="text-[15px] font-semibold text-ink-100">{layer.name}</h3>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-ink-300">{layer.detail}</p>
                    {layer.id === "infra" ? (
                      <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-500">
                        Configuration · Browser · API · Database · Test Data · Reporting · Logging
                      </p>
                    ) : (
                      layer.chips.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {layer.chips.map((c) => (
                            <span key={c} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[10.5px] text-ink-300">
                              {c}
                            </span>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}
                {tab === "dataflow" && (
                  <div key={flow.id} className="animate-fade-in">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: flow.color }} aria-hidden />
                      <h3 className="text-[15px] font-semibold text-ink-100">{flow.title}</h3>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-ink-300">{flow.detail}</p>
                    <p className="mt-4 font-mono text-[11px] text-ink-500">
                      Fast setup through APIs · realistic journeys through the UI · assertions at
                      every layer.
                    </p>
                  </div>
                )}
                {tab === "pipeline" && (
                  <div key={stage.id} className="animate-fade-in">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-500/15 font-mono text-[10px] text-accent-300">
                        {PIPELINE.findIndex((s) => s.id === stage.id) + 1}
                      </span>
                      <h3 className="text-[15px] font-semibold text-ink-100">{stage.title}</h3>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-ink-300">{stage.detail}</p>
                    <p className="mt-4 font-mono text-[11px] text-ink-500">
                      Azure DevOps · YAML pipelines · quality gates on every merge.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
