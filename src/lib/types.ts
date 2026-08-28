export type SnapshotItem = { id: string; title: string; subtitle: string };

export type SkillGroup = {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
  /** bento sizing hint: "lg" spans 2 columns on desktop */
  size?: "lg" | "md";
};

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  approach: string;
  technologies: string[];
  architecture: string;
  outcome: string;
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url: string;
};

export type Principle = { id: string; title: string; description: string };

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  contentType: string;
  uploadedAt: string;
};

export type SectionId =
  | "snapshot"
  | "about"
  | "skills"
  | "architecture"
  | "experience"
  | "projects"
  | "certifications"
  | "principles"
  | "contact";

export type SectionConfig = { id: SectionId; label: string; enabled: boolean };

export type SiteContent = {
  profile: {
    name: string;
    title: string;
    experienceBadge: string;
    tagline: string;
    intro: string;
    heroTech: string[];
    location: string;
    availability: string;
    profileImageUrl: string;
    resumeUrl: string;
  };
  snapshot: { heading: string; items: SnapshotItem[] };
  about: { heading: string; paragraphs: string[]; focusAreas: string[] };
  skills: { heading: string; groups: SkillGroup[] };
  experience: ExperienceEntry[];
  projects: Project[];
  certifications: Certification[];
  principles: Principle[];
  contact: {
    heading: string;
    blurb: string;
    email: string;
    linkedin: string;
    github: string;
    phone: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    siteUrl: string;
  };
  sections: SectionConfig[];
  media: MediaItem[];
};

export type ContentDocument = {
  draft: SiteContent;
  published: SiteContent;
  updatedAt: string;
  publishedAt: string;
  /** true when draft differs from published */
  dirty: boolean;
};
