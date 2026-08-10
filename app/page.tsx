import Link from "next/link";
import Game from "@/components/Game";
import MerchIncentive from "@/components/MerchIncentive";

export default function HomePage() {
  return (
    <div className="home-stack">
      <Game />
      <MerchIncentive />
      <section className="seo-teaser">
        <h2>📖 Become the herd expert</h2>
        <p>
          Ears, size, face, fleece — master the four tells in two minutes, then
          come back and run up your streak.
        </p>
        <p>
          <Link href="/llama-vs-alpaca">Llama vs alpaca: how to tell the difference →</Link>
        </p>
      </section>
    </div>
  );
}
