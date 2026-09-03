import type { SiteContent, SectionId } from "@/lib/types";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Snapshot from "./Snapshot";
import About from "./About";
import Skills from "./Skills";
import Architecture from "./Architecture";
import Experience from "./Experience";
import Projects from "./Projects";
import Certifications from "./Certifications";
import Principles from "./Principles";
import Contact from "./Contact";
import Footer from "./Footer";
import JsonLd from "./JsonLd";

const SECTION_COMPONENTS: Record<
  SectionId,
  (props: { content: SiteContent }) => React.ReactNode
> = {
  snapshot: (p) => <Snapshot {...p} />,
  about: (p) => <About {...p} />,
  skills: (p) => <Skills {...p} />,
  architecture: () => <Architecture />,
  experience: (p) => <Experience {...p} />,
  projects: (p) => <Projects {...p} />,
  certifications: (p) => <Certifications {...p} />,
  principles: (p) => <Principles {...p} />,
  contact: (p) => <Contact {...p} />,
};

export default function PortfolioPage({ content }: { content: SiteContent }) {
  return (
    <div className="relative">
      <JsonLd content={content} />
      <Navbar name={content.profile.name} sections={content.sections} />
      <main>
        <Hero content={content} />
        {content.sections
          .filter((s) => s.enabled)
          .map((s) => (
            <div key={s.id}>{SECTION_COMPONENTS[s.id]?.({ content })}</div>
          ))}
      </main>
      <Footer content={content} />
    </div>
  );
}
