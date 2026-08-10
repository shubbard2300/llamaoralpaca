"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "loa_scores_v2";
const SHOP_URL =
  "https://llama-or-alpaca.myspreadshop.com/?utm_source=llamaoralpaca&utm_medium=incentive-card&utm_campaign=herd-cred";

export default function MerchIncentive() {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setBest(Math.max(s?.classic ?? 0, s?.blitz ?? 0));
      } else {
        setBest(0);
      }
    } catch {
      setBest(0);
    }
  }, []);

  let icon = "🥇";
  let headline = "Earn your herd cred";
  let pitch =
    "Hit a 10-streak and you've officially earned bragging rights. The shirt just makes it public.";
  let cta = "Browse the herd shop";

  if (best !== null && best >= 10) {
    icon = "🏆";
    headline = `Best score: ${best}. Certified herd expert.`;
    pitch = "You can tell a llama from an alpaca faster than most farmers. Make it official.";
    cta = "Claim your herd cred";
  } else if (best !== null && best > 0) {
    icon = "🔥";
    headline = `Best score: ${best}. Getting dangerous.`;
    pitch = "Crack a 10-streak and you've earned the title — and the shirt that proves it.";
    cta = "Preview the prize";
  }

  return (
    <section className="merch-card" aria-label="Merchandise">
      <span className="merch-card-icon" aria-hidden="true">
        {icon}
      </span>
      <h2>{headline}</h2>
      <p>{pitch}</p>
      <a href={SHOP_URL} target="_blank" rel="noreferrer" className="btn-primary merch-card-btn">
        🛍️ {cta} →
      </a>
    </section>
  );
}
