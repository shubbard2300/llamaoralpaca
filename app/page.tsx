import Link from "next/link";
import Game from "@/components/Game";

export default function HomePage() {
  return (
    <>
      <Game />
      <section className="seo-teaser">
        <h2>Can&apos;t tell them apart?</h2>
        <p>
          Ears, size, face, fleece — there are four reliable tells that separate a
          llama from an alpaca. Learn them in two minutes, then come back and run
          up your streak.
        </p>
        <p>
          <Link href="/llama-vs-alpaca">Llama vs alpaca: how to tell the difference →</Link>
        </p>
      </section>
    </>
  );
}
