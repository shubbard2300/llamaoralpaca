"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionProvider";

type MyImage = {
  id: string;
  url: string;
  species: "llama" | "alpaca";
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function UploadPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [species, setSpecies] = useState<"llama" | "alpaca" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mine, setMine] = useState<MyImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  async function loadMine() {
    const res = await fetch("/api/images/mine");
    if (res.ok) {
      const data = await res.json();
      setMine(data.images);
    }
  }

  useEffect(() => {
    if (user) loadMine();
  }, [user]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setMessage(null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!file) {
      setError("Choose a photo first.");
      return;
    }
    if (!species) {
      setError("Tell us: is it a llama or an alpaca?");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("species", species);
      const res = await fetch("/api/images/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Upload failed. Please try again.");
        return;
      }
      setMessage(data?.message ?? "Uploaded!");
      setFile(null);
      setPreview(null);
      setSpecies(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadMine();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="panel">
      <div className="auth-card">
        <h1>Upload a photo</h1>
        <p className="tagline" style={{ fontSize: "0.92rem", marginBottom: 16 }}>
          Share a real llama or alpaca photo. It'll join the game once an admin approves it.
        </p>
        <form onSubmit={handleSubmit}>
          {preview && <img src={preview} alt="Preview" className="upload-preview" />}
          <div className="field">
            <label htmlFor="file">Photo (JPEG, PNG, or WEBP — 8MB max)</label>
            <input id="file" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} ref={fileInputRef} />
          </div>
          <div className="species-toggle">
            <button
              type="button"
              className={species === "llama" ? "active llama" : ""}
              onClick={() => setSpecies("llama")}
            >
              🦙 Llama
            </button>
            <button
              type="button"
              className={species === "alpaca" ? "active alpaca" : ""}
              onClick={() => setSpecies("alpaca")}
            >
              🐑 Alpaca
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
          <button type="submit" className="btn-primary full-width" disabled={submitting}>
            {submitting ? "Uploading…" : "Submit photo"}
          </button>
        </form>
      </div>

      <div className="my-uploads">
        <h2>Your submissions</h2>
        {mine.length === 0 ? (
          <p className="empty-state">No uploads yet — your first one will show up here.</p>
        ) : (
          <div className="upload-grid">
            {mine.map((img) => (
              <div className="upload-thumb" key={img.id}>
                <img src={img.url} alt={img.species} />
                <span className={"upload-status " + img.status}>{img.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
