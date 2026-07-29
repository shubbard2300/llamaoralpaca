"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";
import { useSound } from "./SoundProvider";

export default function Navbar() {
  const { user, loading, setUser } = useSession();
  const { soundOn, toggleSound } = useSound();
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
        <button className="icon-btn" aria-pressed={soundOn} aria-label="Toggle sound" onClick={toggleSound}>
          <svg className="icon-on" viewBox="0 0 24 24">
            <path d="M4 9v6h4l5 5V4L8 9H4z" />
            <path d="M16.5 12a3.5 3.5 0 0 0-2-3.17v6.34A3.5 3.5 0 0 0 16.5 12z" />
            <path d="M14.5 5.14v2.06c2.3.8 4 3 4 5.6s-1.7 4.8-4 5.6v2.06c3.44-.9 6-4 6-7.66s-2.56-6.76-6-7.66z" />
          </svg>
          <svg className="icon-off" viewBox="0 0 24 24">
            <path d="M16.5 12a3.5 3.5 0 0 0-1.4-2.8L16.5 12zM4 9v6h4l5 5V4L8 9H4z" />
            <path d="M19.8 4.2 4.2 19.8l1 1L20.8 5.2z" />
          </svg>
        </button>
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
