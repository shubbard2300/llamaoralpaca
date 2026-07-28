"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";

export default function Navbar() {
  const { user, loading, setUser } = useSession();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-emoji">🦙</span>
        <span className="brand-text">
          Llama <em>or</em> Alpaca
        </span>
      </Link>
      <nav className="topbar-actions">
        {!loading && user && (
          <Link href="/upload" className="nav-link">
            Upload
          </Link>
        )}
        {!loading && user?.isAdmin && (
          <Link href="/admin" className="nav-link">
            Admin
          </Link>
        )}
        {!loading && user && (
          <button className="nav-link nav-link-btn" onClick={handleLogout}>
            Sign out
          </button>
        )}
        {!loading && !user && (
          <>
            <Link href="/login" className="nav-link">
              Log in
            </Link>
            <Link href="/signup" className="nav-link nav-link-strong">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
