export const MAIN_NAV = [
  { href: "/course", label: "Course" },
  { href: "/deal-team", label: "Deal Team" },
  { href: "/tools", label: "Tools" },
  { href: "/newcomers", label: "For newcomers" },
  { href: "/news", label: "News" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const ACCOUNT_NAV = {
  signedOut: [
    { href: "/sign-in", label: "Sign in" },
    { href: "/sign-up", label: "Create account" },
  ],
  signedIn: [{ href: "/dashboard", label: "Dashboard" }],
} as const;
