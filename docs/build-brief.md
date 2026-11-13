# Build prompt: NextOwner web platform

You are a senior full-stack engineer and product designer. Build the NextOwner web platform from scratch as a production-quality, runnable local app. Ask me before making any major product decision that is not covered here.

## 1. What NextOwner is
NextOwner helps **anyone preparing to buy an existing small business in Canada** (entrepreneurship through acquisition, "ETA"). It also has a **dedicated pathway for newcomers to Canada**. Always use the word "newcomers", never "immigrants".

The platform has three core functions, plus the newcomer layer:
1. **Course**: a complete ETA course roadmap that delivers video and reading material.
2. **Deal Team**: help the buyer put together their acquisition team.
3. **Tools**: practice tools for real deal work.
4. **For newcomers**: extra lessons and resources that sit beside the same course. Newcomer status is support only. It is never a penalty and never part of a score.

Main navigation: **Course · Deal Team · Tools · For newcomers · Pricing**, plus Sign in, Create account and Dashboard.

## 2. Pages and how they work

### Home
- Positioning for all buyers: "Prepare to buy a small business in Canada with a clearer map."
- The newcomer line is secondary: "New to Canada? There's an extra pathway for you."
- A visual of the 12-module path.
- Three cards: Course, Deal Team and Tools.
- Calls to action: "Start with the course" and "For newcomers".

### Course (`/course`, `/course/[module]`, `/course/[module]/[lesson]`)
The course has 12 modules, numbered 0 to 11. Every module has:
- learning outcomes,
- written lessons,
- a video slot,
- readings, at least two public sources each, labelled FREE or PAID,
- a practical output the learner produces,
- a quiz of at least three questions,
- a link to a related tool.

| # | Module | Practical output |
|---|---|---|
| 0 | Is buying a business right for me? (self-funded, search fund, partner, family or internal) | Personal fit statement |
| 1 | Acquisition thesis and criteria (sector, size, geography, your edge) | One-page thesis |
| 2 | Sourcing and outreach (brokers, proprietary deals, Repreneuriat Québec, Futurpreneur) | Target list and outreach letter |
| 3 | Screening a CIM and small-business financials (SDE vs EBITDA, red flags) | Screening memo |
| 4 | Quality of earnings and normalization (add-backs) | Adjusted earnings sheet |
| 5 | Valuation basics (multiples, DCF basics, price vs value) | Valuation range |
| 6 | Financing in Canada (bank, BDC, CSBFP, vendor take-back, earn-out, equity) | Capital stack and lender pack checklist |
| 7 | LOI and negotiation | Practice LOI term sheet |
| 8 | Due diligence and the data room | Due-diligence findings log |
| 9 | Legal and tax structure (share vs asset purchase, purchase agreement, reps and warranties) | Questions for your lawyer and CPA |
| 10 | Closing and transition (first 100 days, employees, customers) | 100-day plan |
| 11 | Capstone: deal pitch to a mock committee | One-page deal pitch |

Seed readings with public sources only and link them. Never copy paid course content. Starting sources:
- BDC "Buying a business in Canada" guide: https://www.bdc.ca/en/articles-tools/entrepreneur-toolkit/guides/buying-business-canada
- BDC business acquisition toolkit and due-diligence checklist (bdc.ca)
- The Canada Small Business Financing Program (CSBFP): https://ised-isde.canada.ca/site/canada-small-business-financing-program/en
- The BDC acquisition loan page (bdc.ca)
- The Stanford search fund primer, the Chicago Booth Polsky Center "ETA Insider" podcast, and Repreneuriat Québec

Progress and video:
- **Progress:** track it per lesson and per module for signed-in users. Show a "Continue where you left off" button. Quiz results are saved.
- **Video:** a "Video coming soon" slot. Never fake a player. Build the data model so a video URL can be added later.
- **Format:** store content as editable MDX or JSON files.

### Deal Team (`/deal-team`)
Explain each role:
- business broker,
- lawyer,
- accountant or CPA,
- lender or banker,
- business valuator,
- insurance advisor,
- mentor,
- (newcomers) settlement and newcomer-business programs.

For each role, cover what they do, what they don't do, when you need them, and the questions to ask them.

A signed-in user can build and save a private team list with name, firm, role, status (not contacted, talking, engaged) and notes. There is no public directory, and the platform sends no outreach.

### Tools (`/tools`)
These are working now:
- **Affordability calculator.**
  - Inputs: purchase price, down payment, seller financing (vendor take-back), bank rate and term, seller-note rate and term, and annual business cash flow (SDE).
  - Outputs: bank principal, monthly bank payment, monthly seller-note payment, total debt service, debt service coverage (cash flow divided by debt service), buyer take-home per month before tax, and cash to close.
  - Use fully amortizing monthly payments and allow a 0% rate. Users can save named scenarios.
- **Deal-readiness checklist:** a saved checklist that shows a count. It is not a score.

Show these as "Planned":
- an AI mentor,
- a CIM teardown,
- a quality-of-earnings workbench,
- a valuation sandbox,
- a capital-stack builder,
- an LOI builder,
- a data-room hunt,
- negotiation practice,
- a "who handles this?" mapper that points to the Deal Team.

### For newcomers (`/newcomers`)
A pathway page with these supplements, linked into the matching course modules:
- N1: building Canadian credit from scratch, with links to the Financial Consumer Agency of Canada (FCAC).
- N2: financing conversations as a newcomer. Link BDC's newcomer page and don't claim it covers acquisitions.
- N3: presenting your foreign experience, and Canadian business culture with owners.
- N4: Québec and French terms.
- N5: immigration status and business ownership. This is general only, with no immigration advice.
- N6: extra people for your Deal Team, such as settlement and newcomer-business programs.

The newcomer track is a self-declared toggle in the user's profile. Anyone can read the supplements.

### Pricing (`/pricing`)
- A free course preview.
- A placeholder "Individual package" at **$199 one-time**, with contents to be decided.
- No real checkout. The button stays disabled ("Coming soon").

### Accounts and dashboard
- **Accounts:** sign up and sign in with email and a hashed password. Data stays isolated between users.
- **Dashboard:** course progress, next lesson, saved Deal Team, saved calculator scenarios and the checklist.

## 3. Content rules
- Lessons on financing, legal, tax, valuation and immigration status carry: "Educational only, not advice. Pending professional review."
- Use one clear notice. Don't repeat the hedging all over the marketing copy.
- The copy is warm, confident and in plain language.
- Cite sources and don't claim any university affiliation. The platform makes no credit-approval or valuation claims.
- English first. French has a `/fr` route, but all French is marked **draft**. Never present machine translation as final.

## 4. Design
- Fresh, distinctive and premium, not a generic SaaS template.
- Calm, confident palette (for example warm paper and deep cedar green), an editorial serif for headings and a clean sans for body text.
- Generous whitespace, responsive (a good mobile menu), and accessible (WCAG AA).
- The logo isn't final, so use a `[LOGO]` text slot.

## 5. Tech and constraints
- **Stack:** Next.js (App Router) with TypeScript and Tailwind, plus SQLite through Prisma or Drizzle. It must run with `npm install && npm run setup && npm run dev`, and the README documents this.
- **Off limits:**
  - real payments,
  - paid APIs or AI keys,
  - emails to real people,
  - public deployment.
- Seed one local demo account and never print secrets.
- **Tests:**
  - calculator math (for example, $100,000 at 6% over 10 years gives a monthly payment of about $1,110.21),
  - lesson progress,
  - user data isolation,
  - navigation,
  - the 12-module structure,
  - review notices,
  - no use of the word "immigrants".
  
  Lint, typecheck and build must all pass.

## 6. Deliver
A running app, a README, passing tests, and a short report covering what you built, what is incomplete, and which decisions I need to confirm (paid package contents, which tools to build next, video presenter, and professional reviewers).
