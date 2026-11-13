# Design research and decisions

Research done on Nov 12, 2026 to guide NextOwner's look and structure.

## What we looked at

- **Online course platforms** such as Kajabi, Thinkific, Teachable and Maven. Their course pages tend to share a structure: a clear curriculum list, a free preview, a progress bar and one primary call to action per page. Editorial-style course sites with a muted, neutral palette read as more credible than template-style ones.
- **ETA courses.** We looked at courses from the University of Washington, Duke Fuqua, Babson, NYU Stern, Case Western Weatherhead, Haskayne (University of Calgary) and Maven's ETA 101. Most follow the buyer's journey: decide, search, evaluate, finance, close, operate. That journey became the six phases that group the 12 modules: Decide, Find, Analyze, Finance and negotiate, Verify and structure, Own.
- **Finance and fintech sites**, including reviews of financial-services web design and examples such as Wise and Northwestern Mutual. Calm palettes, deep greens and blues, generous whitespace and authoritative serif headings signal trust. Interactive calculators work well as the centre of a page.
- **BioRender** templates for roadmaps and timelines, such as "Project Timeline" and "Timeline (6 Segments)". BioRender's library is mainly scientific illustration, so no BioRender assets are used in the site. Its timeline layouts informed the phase-grouped module path.

## Decisions

| Decision | Why |
| --- | --- |
| Warm paper background (`#F6F1E7`) and deep cedar green (`#1F3D2E` / `#132A1F`) | Calm and trustworthy, and it avoids the cold blue SaaS look |
| Fraunces for headings, Inter for body text | Fraunces gives an editorial, educational voice; Inter keeps forms and numbers legible |
| Clay accent (`#8A3F21`) for newcomer content | Signals the extra pathway without separating it from the main course |
| Brass (`#A9822C`) for review notices and the focus ring | One consistent colour for "pay attention" |
| Module path grouped by phase | Shows the whole journey at a glance, on the home page and the dashboard |
| Calculator results in a dark panel | Puts the key numbers (coverage and take-home pay) in focus |
| `[LOGO]` text slot | The logo has not been decided yet |

## Design pass 2 (Nov 12, 2026)

The first version looked plain. The second pass added:

- **Home hero:** a dark cedar hero with a grid texture and soft glows, and a product preview built in code (course path, calculator result and Deal Team cards) instead of empty space.
- **Header:** a sticky, translucent header with pill navigation that marks the active page, and buttons with arrows and depth.
- **Home sections:**
  - a strip naming the public sources the readings link to
  - a stats band
  - module-path phase cards with icons
  - a bento grid of features
  - "How it works" steps
  - an FAQ accordion
  - a closing call to action
- **Inner pages:** a shared header band (`PageHeader`) used across them.
- **Dashboard and pricing:** a dark dashboard header and a dark pricing card.
- **Calculator:** numbers now show thousands separators.
- **Icons:** `lucide-react`.
- **Motion:** subtle rise and float animations, which are switched off when the user prefers reduced motion.

## Design pass 3: Ledger, refined (Nov 12, 2026)

Three landing directions were laid out on a design canvas: A, Ledger (dark editorial); B, Daylight (bright modern); and C, Atlas (map). The owner chose A and asked for a more professional finish. The refined version, which is now live, has:

- **Hero:** a deep cedar hero (`#10241A`) with a fine grid, one soft gold glow, a light-weight Fraunces headline (weight 350) and a gold accent (`#E6CC8A`).
- **Hero visual:** a detailed dashboard composite with a progress ring, next lesson, coverage card, Deal Team statuses, and floating "practical output" and "quiz" cards.
- **Header:** dark on the home page and light elsewhere, with an underline marking the active page.
- **Below the hero:**
  - a fact bar that overlaps the hero
  - a strip naming the public sources
  - interactive phase tabs that show each phase's modules and what you produce
- **Feature rows:** three alternating rows (lessons, Deal Team, calculator). The calculator figures are computed live by the real calculator.
- **Closing sections:** a split newcomer block, "How we built it" principles, an FAQ and a dark call to action, then a darker footer.

## Motion (Nov 12, 2026)

- **Hero:** the badge, headline, text, buttons and ticks rise in one after another. "clearer map." has a slow gold shine. The progress ring draws itself, the coverage bars grow, the preview cards float gently and the background glow drifts.
- **Fact bar:** the numbers count up when they scroll into view (`CountUp`).
- **Scroll reveal:** sections, cards and feature rows fade and lift into view (`Reveal`, using IntersectionObserver). This is applied on the home, course, Deal Team and newcomer pages.
- **Phase tabs:** the phase card and its module cards fade in, one after another, whenever you switch tabs.
- **FAQ:** answers fade in when opened.
- **Hover:** cards lift and arrows nudge to the right.
- **Accessibility:** under `prefers-reduced-motion`, every animation is off and all content shows immediately. Content is only hidden once JavaScript is running (the `data-js` flag), so nothing is ever stuck invisible.

## Screenshots

See `docs/screenshots/`:

1. `01-home.png`: the home page
2. `02-module.png`: a module page with the quiz answered
3. `03-lesson.png`: a lesson
4. `04-calculator.png`: the affordability calculator with a saved scenario
5. `05-dashboard.png`: the dashboard
6. `06-deal-team.png`: the Deal Team page
7. `07-newcomers.png`: the newcomer pathway
8. `08-pricing.png`: the pricing page
9. `09-mobile-home.png`: the home page on mobile
10. `10-mobile-menu.png`: the mobile menu

## Sources

- [Colorlib: online course website examples](https://colorlib.com/wp/online-course-website-examples/)
- [Teachery: course platforms and design customization](https://www.teachery.co/blog/best-course-platform-design-customization)
- [Articulate Marketing: B2B fintech websites](https://articulatemarketing.com/lp-best-b2b-fintech-websites)
- [Halo Lab: financial services website designs](https://www.halo-lab.com/blog/the-best-financial-website-designs-to-inspire-you)
- [Digidop: 2026 design trends for finance websites](https://www.digidop.com/blog/2026-design-trends-for-finance-websites)
- [Font pairings for fintech websites](https://pairperfect-u9.pages.dev/recommended-font-pairings-for-fintech-websites-industry-font-pairings)
- [Duke Fuqua: ETA](https://centers.fuqua.duke.edu/cei/eta/index.html)
- [NYU Stern: ETA executive education](https://execed.stern.nyu.edu/products/entrepreneurship-through-acquisition-a-proven-path-to-ownership)
- [Haskayne: ETA](https://haskayne.ucalgary.ca/eta)
