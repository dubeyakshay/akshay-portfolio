import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";
import CopyButton from "./CopyButton";

export default function Contact({ content }: { content: SiteContent }) {
  const { contact, profile } = content;

  const channels = [
    contact.email && {
      key: "email",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: <path d="M2.5 4.5h13v9h-13zM2.5 5l6.5 5 6.5-5" />,
    },
    contact.linkedin && {
      key: "linkedin",
      label: "LinkedIn",
      value: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      href: contact.linkedin,
      icon: (
        <path d="M4 6.5v6M4 3.9v.01M7.5 12.5V9.2c0-1.5 1-2.4 2.3-2.4s2.2.9 2.2 2.4v3.3M7.5 6.5v6" />
      ),
    },
    contact.github && {
      key: "github",
      label: "GitHub",
      value: contact.github.replace(/^https?:\/\/(www\.)?/, ""),
      href: contact.github,
      icon: (
        <path d="M11 14v-2.1c0-.6-.2-1-.5-1.3 1.7-.2 3.5-.8 3.5-3.7 0-.8-.3-1.5-.8-2 .1-.2.4-1-.1-2 0 0-.6-.2-2.1.8a7 7 0 0 0-3.7 0C5.8 2.7 5.2 2.9 5.2 2.9c-.5 1-.2 1.8-.1 2-.5.5-.8 1.2-.8 2 0 2.9 1.8 3.5 3.5 3.7-.3.3-.5.7-.5 1.3V14" />
      ),
    },
    contact.phone && {
      key: "phone",
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^+\d]/g, "")}`,
      icon: (
        <path d="M3 2.5h3l1.2 3.2-1.7 1.4a9.5 9.5 0 0 0 3.4 3.4l1.4-1.7 3.2 1.2v3a1 1 0 0 1-1.1 1A11.5 11.5 0 0 1 2 3.6a1 1 0 0 1 1-1.1z" />
      ),
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
  }[];

  return (
    <section id="contact" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <div
              className="pointer-events-none absolute -top-24 right-0 h-64 w-96 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(59,118,224,0.5), transparent 70%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <p className="section-label mb-3">{contact.heading}</p>
              <h2 className="heading-xl mb-3">Let&apos;s talk quality.</h2>
              <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-ink-300">
                {contact.blurb}
              </p>

              {channels.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {channels.map((c) => (
                    <a
                      key={c.key}
                      href={c.href}
                      target={c.key === "linkedin" || c.key === "github" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all hover:border-accent-400/40 hover:bg-white/[0.06]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-base-900 text-accent-300">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                          {c.icon}
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium uppercase tracking-wider text-ink-500">
                          {c.label}
                        </span>
                        <span className="block truncate text-[14px] font-medium text-ink-100 group-hover:text-accent-300">
                          {c.value}
                        </span>
                      </span>
                      {(c.key === "email" || c.key === "phone") && (
                        <CopyButton value={c.value} label={c.label} />
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-[14px] text-ink-400">
                  Contact details will appear here once configured.
                </p>
              )}

              {profile.resumeUrl && (
                <div className="mt-8">
                  <a href={profile.resumeUrl} download className="btn-primary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 2v7M4 6.5L7 9.5 10 6.5M2.5 12h9" />
                    </svg>
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
