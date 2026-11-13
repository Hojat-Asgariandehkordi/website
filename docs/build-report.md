# NextOwner web platform: build report (Nov 12, 2026)

How to run it: `npm install && npm run setup && npm run dev`

## Built
- **Course:** 12 modules (0 to 11) with 25 written lessons. Each module has learning outcomes, "Video coming soon" slots with a video URL field ready to fill, 2 to 4 readings labelled FREE or PAID, a practical output and a 4-question quiz. Signed-in users' progress is saved per lesson and per module, with "Continue where you left off" and saved quiz results.
- **Deal Team:** 8 roles, each covering what they do, what they don't do, when you need them and questions to ask. Signed-in users can keep a private team list with a status for each person. There is no directory and the platform sends no outreach.
- **Tools:**
  - An affordability calculator. Payments are fully amortizing, 0% rates are allowed and users can save named scenarios.
  - A deal-readiness checklist. It shows a count, not a score.
  - Nine more tools are shown as "Planned".
- **For newcomers:** supplements N1 to N6, each linked into the matching modules, and a self-declared newcomer track on the user's profile.
- **Pricing:** a free preview, and a $199 placeholder package whose button is disabled ("Coming soon").
- **Accounts and dashboard:** passwords hashed with bcrypt, session tokens stored as hashes, and every query scoped to the signed-in user.
- **French:** `/fr` is a French landing page marked as a draft.
- **Design:** warm paper and cedar green, Fraunces and Inter, a `[LOGO]` slot, a mobile menu, a skip link and focus styles. See `docs/design-research.md`.
- **Checks:**
  - 51 tests pass, and lint, typecheck and build pass.
  - A browser test covered sign-up, progress, quizzes, the team list, scenarios, the checklist, the dashboard, isolation between two users and the mobile menu.

## Incomplete
- No real videos yet.
- No password reset or email verification, because sending email was out of scope.
- No automated WCAG audit. Contrast and keyboard access were only checked by hand.
- French covers the landing page only.
- Four reference links have not been checked:
  - IRCC newcomer services
  - Corporations Canada
  - Innovation Canada
  - CICC

## Decisions to confirm
1. **The $199 package.** What does it contain, and should modules 2 to 11 be locked? Right now everything is readable, and modules 0 and 1 carry a "Free preview" badge.
2. **Next tools.** Suggested order: the capital-stack builder, then the quality-of-earnings workbench.
3. **Video presenter.** Who presents the videos?
4. **Professional reviewers.** Who reviews the finance, legal, tax, valuation and immigration-status content? Every page that carries the review notice is listed in the tests.
5. **Closing costs input.** Should the optional "closing costs" input stay in the calculator? It was added so that "cash to close" includes more than the down payment.
