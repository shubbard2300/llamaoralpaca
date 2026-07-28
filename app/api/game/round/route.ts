import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const dynamic = "force-dynamic";

export async function GET() {
  // A fresh random batch of 10-15 approved photos per game session, mixed
  // llama/alpaca, drawn from the full approved pool (50+ once seeded).
  const total = Math.floor(Math.random() * 6) + 10; // 10..15
  const perSpecies = Math.ceil(total / 2);

  const [llamas, alpacas] = await Promise.all([
    query(
      `select id, url, species, attribution_name, attribution_url, license
       from images where status = 'approved' and species = 'llama'
       order by random() limit $1`,
      [perSpecies]
    ),
    query(
      `select id, url, species, attribution_name, attribution_url, license
       from images where status = 'approved' and species = 'alpaca'
       order by random() limit $1`,
      [perSpecies]
    ),
  ]);

  const images = shuffle([...llamas, ...alpacas]).slice(0, total);

  return NextResponse.json({
    images,
    requested: total,
    available: llamas.length + alpacas.length,
  });
}
