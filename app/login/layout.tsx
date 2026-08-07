import type { Metadata } from "next";

// Auth page with no unique indexable content; already disallowed in
// robots.txt. noindex added for consistency/defense-in-depth.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
