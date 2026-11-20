# Guide for AI coding assistants (Cursor, Claude Code and others)

Read this before changing anything. The product brief is in `docs/build-brief.md`. What has been built, and what is still open, is in `docs/build-report.md`.

## What this project is

NextOwner helps anyone preparing to buy an existing small business in Canada (entrepreneurship through acquisition, or ETA). It also has a dedicated pathway for newcomers to Canada. The product has:

- a 12-module course, numbered 0 to 11
- a Deal Team guide with a private team list
- practice tools
- newcomer supplements N1 to N6

## Run and verify

```bash
npm install && npm run setup && npm run dev   # http://localhost:3000
npm run check                                 # runs lint, typecheck, tests and build
```

Run `npm run check` before every commit. All four steps must pass.

## Rules that must not be broken

These are enforced by the tests in `tests/`.

1. Always write "newcomers". Never use the word "immigrants" in the code, content or UI. A test scans `src/`, `content/` and `README.md` for it.
2. Newcomer status is support only. Never use it as a penalty, a filter or part of any score.
3. Lessons on financing, legal, tax, valuation and immigration status show one notice: "Educational only, not advice. Pending professional review." To add it, set `"reviewNotice": true` in the content JSON. Keep the notice off marketing pages.
4. Never fake a video player. A real player appears only when a video `url` is set; otherwise the page shows "Video coming soon".
5. All French text is a draft. Never present it, or any machine translation, as final.
6. Readings must be public sources with links, each labelled FREE or PAID. Never copy paid course content.
7. Make no claims about credit approval, valuations or university affiliation.
8. Do not add real payments, paid APIs or AI keys, emails to real people, public deployment or a public directory of people.
9. Every query that touches user data must filter on `userId`. All data access lives in `src/lib/repo.ts`.
10. Never print secrets. The demo password goes to `data/demo-credentials.txt`, which git ignores.
11. News items are published only after a person writes the summary in their own words. Never paste text from a news source, and never publish feed items automatically. `npm run news:approve` enforces the rules in `src/lib/news-rules.ts`.
12. Keep the `[LOGO]` text slot in `src/components/Logo.tsx` until a final logo is chosen.

## Map of the code

| Path | Purpose |
| --- | --- |
| `content/modules/*.json` | One file per course module: lessons (Markdown subset), readings, quiz, practical output |
| `content/deal-team.json`, `newcomers.json`, `checklist.json`, `tools.json` | Other editable content |
| `content/news.json` | Published news items (summaries in our own words) and news topics |
| `content/news-feeds.json` | Public RSS/Atom feeds and keywords for the news importer |
| `src/lib/news.ts`, `src/lib/news-rules.ts`, `src/lib/rss.ts` | News loaders, unread logic, publishing rules, feed parser |
| `src/lib/content.ts` | Content types and loaders |
| `src/lib/calculator.ts` | Affordability math; pure functions; fully amortizing monthly payments; 0% rate allowed |
| `src/lib/repo.ts` | All database reads and writes, scoped to a user |
| `src/lib/schema.ts`, `src/lib/db.ts` | SQLite schema, managed with Drizzle |
| `src/lib/auth.ts` | Sessions: an httpOnly cookie, stored in the database as a SHA-256 hash |
| `src/app/**` | Routes (Next.js App Router) |
| `src/app/actions/*.ts` | Server actions, with input validated by zod |
| `src/components/*` | UI components |
| `tests/*` | Vitest tests |
| `docs/` | Brief, build report, design notes and screenshots |

## Design system

Tokens live in `tailwind.config.ts`:

- **Colours:**
  - `paper` (warm background)
  - `ink` (text)
  - `cedar` (primary green)
  - `clay` (newcomer accent)
  - `brass` (notices)
- **Fonts:** Fraunces (serif) for headings, Inter for body text, both loaded locally through Fontsource.
- **Shared classes:** `btn-primary`, `btn-secondary`, `card`, `field`, `link`, `eyebrow`, `tag`. They are defined in `src/app/globals.css`.

Keep text contrast at WCAG AA, keep the `:focus-visible` styles and give every form field a label.

## Decisions still open

Ask the owner before deciding any of these:

- what the paid package contains
- which tools to build next
- who presents the videos
- who the professional reviewers are
