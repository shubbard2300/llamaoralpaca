import type { Metadata } from "next";

// This page shows a signed-in user's own submissions, including photos still
// pending moderation. Already disallowed in robots.txt; noindex is added
// here too so a pending photo can't end up in search results even if the
// URL is discovered some other way.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
