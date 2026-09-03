import type { SiteContent } from "@/lib/types";

/**
 * JSON-LD structured data (schema.org Person + WebSite) for rich search
 * results. Only includes fields that actually have values — nothing invented.
 */
export default function JsonLd({ content }: { content: SiteContent }) {
  const { profile, contact, seo } = content;

  const sameAs = [contact.linkedin, contact.github].filter(Boolean);

  const person: Record<string, unknown> = {
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.intro,
    knowsAbout: profile.heroTech,
  };
  if (seo.siteUrl) person.url = seo.siteUrl;
  if (contact.email) person.email = `mailto:${contact.email}`;
  if (sameAs.length) person.sameAs = sameAs;

  const graph: Record<string, unknown>[] = [person];

  if (seo.siteUrl) {
    graph.push({
      "@type": "WebSite",
      url: seo.siteUrl,
      name: seo.title || `${profile.name} — ${profile.title}`,
      description: seo.description,
    });
  }

  const data = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
