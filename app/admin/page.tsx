"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionProvider";

type PendingImage = {
  id: string;
  url: string;
  species: "llama" | "alpaca";
  status: string;
  created_at: string;
  uploader_email: string | null;
  uploader_name: string | null;
};

export default function AdminPage() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<PendingImage[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/");
  }, [loading, user, router]);

  async function load() {
    const res = await fetch("/api/admin/images");
    if (res.ok) {
      const data = await res.json();
      setImages(data.images);
    }
  }

  useEffect(() => {
    if (user?.isAdmin) load();
  }, [user]);

  async function review(id: string, action: "approve" | "reject") {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/images/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) setImages((imgs) => imgs.filter((i) => i.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  if (loading || !user?.isAdmin) return null;

  return (
    <div className="panel panel-wide">
      <h1 style={{ textAlign: "center", marginBottom: 18 }}>Photo moderation queue</h1>
      {images.length === 0 ? (
        <p className="empty-state">Nothing pending — all caught up! 🎉</p>
      ) : (
        <div className="admin-list">
          {images.map((img) => (
            <div className="admin-row" key={img.id}>
              <img src={img.url} alt={img.species} />
              <div className="admin-meta">
                <strong>{img.species}</strong>
                {img.uploader_name ?? img.uploader_email ?? "Unknown uploader"} ·{" "}
                {new Date(img.created_at).toLocaleString()}
              </div>
              <div className="admin-actions">
                <button className="approve-btn" disabled={busyId === img.id} onClick={() => review(img.id, "approve")}>
                  Approve
                </button>
                <button className="reject-btn" disabled={busyId === img.id} onClick={() => review(img.id, "reject")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
