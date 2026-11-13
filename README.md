# NextOwner

NextOwner helps anyone preparing to buy an existing small business in Canada (entrepreneurship through acquisition, or ETA). It has a dedicated pathway for newcomers to Canada.

- **Course**: a 12-module ETA roadmap (modules 0 to 11) with lessons, a video slot, readings, a practical output and a quiz per module
- **Deal Team**: what each professional does, plus a private team list for signed-in users
- **Tools**: a working affordability calculator and a deal-readiness checklist; nine more tools are shown as planned
- **For newcomers**: six supplements (N1 to N6) linked into the matching modules
- **Pricing**: a free preview and a placeholder $199 package with checkout disabled

This is a local prototype. It takes no payments, calls no paid APIs or AI services, sends no email and is not deployed anywhere.

## Documentation

| File | What's in it |
| --- | --- |
| `AGENTS.md` | Rules and a code map for AI coding assistants such as Cursor. Read it first. |
| `docs/build-brief.md` | The original product brief |
| `docs/build-report.md` | What is built, what is incomplete and the decisions still open |
| `docs/design-research.md` | Design research, design decisions and sources |
| `docs/screenshots/` | Screenshots of the running app |

## Run it

You need Node.js 20 or newer.

```bash
npm install && npm run setup && npm run dev
```

Then open http://localhost:3000.

`npm run setup` creates the SQLite database at `data/nextowner.db` and seeds one demo account, `demo@nextowner.local`. The demo password is never printed to the terminal:

- If you set `DEMO_PASSWORD` before running setup, that password is used.
- If you don't, a random password is generated and written to `data/demo-credentials.txt`. Git ignores this file.

To start again from scratch, delete `data/nextowner.db*` and `data/demo-credentials.txt`, then run `npm run setup` again.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run setup` | Create the database and seed the demo account |
| `npm test` | Run the test suite (Vitest) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler with no output |
| `npm run build` | Create a production build |
| `npm run check` | Run lint, typecheck, tests and build, in that order |

## Stack

- Next.js 15 (App Router), React 19 and TypeScript
- Tailwind CSS 3, with Fraunces (serif headings) and Inter (body text) loaded locally through Fontsource
- SQLite through Drizzle ORM and better-sqlite3
- Email and password accounts: bcrypt hashes, and random session tokens stored as SHA-256 hashes in an httpOnly cookie
- Vitest for tests

## Where things live

```
content/
  modules/00-…json … 11-…json   one editable JSON file per course module
  deal-team.json                  Deal Team roles
  newcomers.json                  newcomer supplements N1 to N6
  checklist.json                  deal-readiness checklist items
  tools.json                      working and planned tools
src/
  app/                            routes (pages) and server actions
  components/                     UI components
  lib/calculator.ts               affordability math (pure functions)
  lib/repo.ts                     all data access; every query is scoped to a user id
  lib/schema.ts                   database schema
scripts/setup.ts                  database setup and demo seed
tests/                            test suite
```

### Editing course content

Lessons are written in a small Markdown subset: `## heading`, paragraphs, `- bullet` lists, `1. numbered` lists, `**bold**` and `[links](https://…)`. No raw HTML is rendered.

Every lesson and every module has a `video` object with `url` and `presenter`, both `null` for now. Until a URL is set, the page shows a "Video coming soon" slot. Once you set a URL, a real player appears.

Set `"reviewNotice": true` on a module or supplement to show the notice "Educational only, not advice. Pending professional review."

### Language

English comes first. `/fr` is a French landing page, and all of its French is marked as a draft until a qualified translator reviews it.

## Tests

The suite covers:

- calculator math, including $100,000 at 6% over 10 years giving about $1,110.21 a month, 0% rates and full amortization
- lesson progress, "continue where you left off" and saved quiz results
- user data isolation for team lists, scenarios, progress, quizzes and checklists
- navigation and cross-links between content
- the 12-module structure and its required parts
- review notices
- language rules, including never using the word for people that this project replaces with "newcomers"
