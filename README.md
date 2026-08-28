# QA Automation Engineer — Portfolio + Private CMS

A production-ready personal portfolio for a senior QA Automation Engineer (11+ years),
with a **private `/admin` CMS** so all content is managed from the browser — no code
edits, no redeploys.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Vercel Blob storage · JWT auth

---

## Features

### Public site (`/`)
- Premium dark theme, glass surfaces, subtle gradients, scroll-reveal micro-animations
- Hero with name, title, experience badge, tech chips, CTA buttons and profile photo
  (elegant monogram fallback when no photo is set)
- Recruiter Snapshot, About, Technical Expertise bento grid
- **Interactive Automation Architecture diagrams** (3 clickable views):
  - Framework layers: Tests → Steps → Page Objects → Infrastructure
  - Hybrid flow: API → Create Test Data → UI → Validate
  - Pipeline: Commit → Build → Tests → Report → Pass/Fail
- Experience timeline, case-study Projects, Engineering Principles,
  Certifications (hidden until you add some), Contact
- Server-rendered & SEO-friendly (metadata, robots.txt, sitemap.xml)
- Fully responsive (mobile / tablet / desktop) and respects `prefers-reduced-motion`
- **No broken links:** resume/photo buttons are hidden automatically when the file
  doesn't exist; empty contact fields and project URLs are simply not rendered

### Admin CMS (`/admin`)
- Secure login (bcrypt password + signed HttpOnly JWT session cookie, middleware-guarded)
- Edit: Profile, About, Snapshot, Experience, Projects, Skills, Certifications,
  Contact & Social links, SEO
- Add / edit / delete / **reorder** entries everywhere
- Upload / delete images (media library), upload / replace resume PDF
- Enable / disable and **reorder site sections**
- **Save Draft → Preview → Publish** workflow:
  - *Save Draft* stores changes without touching the live site
  - *Preview* opens `/preview` (admin-only) rendering the draft
  - *Publish* promotes the draft to the live site instantly
  - *Discard* reverts the draft to the published version

### Architecture
```
src/
├── app/
│   ├── page.tsx                 # public site (published content, ISR)
│   ├── preview/                 # draft preview (admin-only)
│   ├── admin/                   # CMS dashboard + login
│   └── api/admin/               # login, logout, content, upload endpoints
├── components/
│   ├── site/                    # public UI components
│   └── admin/                   # CMS shell + editors
├── lib/
│   ├── types.ts                 # content model
│   ├── defaultContent.ts        # initial (placeholder) content
│   ├── content.ts               # content service: draft/publish, merging
│   ├── storage.ts               # storage adapter: Vercel Blob ⇄ filesystem
│   ├── auth.ts                  # credentials, JWT sessions
│   └── assets.ts                # broken-link guard for local assets
└── middleware.ts                # edge guard for /admin, /preview, /api/admin
```

Content lives in a single versioned JSON document (`draft` + `published`) stored in
**Vercel Blob** in production (or `./.data/content.json` locally). Uploaded files go to
Blob (or `./public/uploads` locally). No localStorage anywhere.

---

## Local development

```bash
npm install
cp .env.example .env.local     # then fill it in (see below)
npm run dev                    # http://localhost:3000
```

`.env.local` for development:

```env
ADMIN_USERNAME=admin
# bcrypt hash — IMPORTANT: escape every $ as \$ in .env files
ADMIN_PASSWORD_HASH=\$2b\$10\$X5IaMiQ1LiABU8.xhGwqwepc5lpQqPdAgXCE35zNFNs3StRAYPtne
AUTH_SECRET=dev-secret-change-me-0123456789abcdef
```

The hash above corresponds to the password `admin12345` (dev only — change it!).

Generate a hash for your own password:

```bash
node scripts/hash-password.mjs "your-strong-password"
```

Locally (no `BLOB_READ_WRITE_TOKEN` set) content is stored in `./.data/content.json`
and uploads in `./public/uploads/` — both git-ignored.

---

## Deploying to Vercel

1. **Push to GitHub** and import the repo in Vercel (framework auto-detected: Next.js).

2. **Create a Blob store**: Vercel dashboard → your project → *Storage* → *Create* →
   **Blob** → connect it to the project. Vercel injects `BLOB_READ_WRITE_TOKEN`
   automatically. This is what makes content persist across deployments and
   serverless instances.

3. **Set environment variables** (Project → Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `ADMIN_USERNAME` | your admin login name |
   | `ADMIN_PASSWORD_HASH` | output of `node scripts/hash-password.mjs "…"` (no `\` escaping needed in the Vercel UI) |
   | `AUTH_SECRET` | output of `openssl rand -base64 32` |

4. **Deploy.** Then:
   - visit `https://your-site.vercel.app/admin`
   - log in, replace all placeholder content (name, experience, contact links…)
   - upload your photo and resume
   - **Save Draft → Preview → Publish**
   - set *SEO → Site URL* to your deployed domain (enables sitemap/canonical URLs)

### Optional static assets
Instead of uploading via admin you can also commit files:
- `public/images/profile.jpg` → set Profile → photo URL to `/images/profile.jpg`
- `public/resume.pdf` → the default resume URL already points there

If those files are absent the site hides the corresponding buttons/images —
nothing renders broken.

---

## Content honesty

The seed content intentionally contains **editable placeholders** (e.g. "Company
Name", "Start date") instead of fabricated employers, dates, metrics, certifications
or URLs. Replace them with your real information in `/admin`. Empty GitHub/demo/contact
fields are hidden on the public site rather than filled with fakes.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build (type-checks + lints) |
| `npm start` | serve the production build |
| `node scripts/hash-password.mjs "pw"` | bcrypt hash for `ADMIN_PASSWORD_HASH` |

## Security notes

- `/admin`, `/preview` and `/api/admin/*` are enforced by **edge middleware** — public
  visitors are redirected/401'd before any page code runs.
- Sessions are signed HS256 JWTs in an HttpOnly, SameSite=Lax cookie (12 h expiry).
- Login endpoint has basic per-IP throttling.
- Admin pages send `robots: noindex` and are excluded in `robots.txt`.
- Secrets live only in environment variables — nothing sensitive is committed.
