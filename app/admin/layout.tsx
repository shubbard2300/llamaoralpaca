import type { Metadata } from "next";

// The moderation queue lists unapproved, user-submitted photos. robots.txt
// already disallows crawling this path, but a disallow rule alone doesn't
// stop a URL from being indexed if it's ever linked from elsewhere — so add
// an explicit noindex here as defense-in-depth against pending photos
// surfacing in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
