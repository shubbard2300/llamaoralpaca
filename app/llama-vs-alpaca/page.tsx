import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.llamaoralpaca.com";
const TITLE = "Llama vs Alpaca: How to Tell the Difference";
const DESCRIPTION =
  "Ears, size, face, and fleece — the four tells that separate a llama from an alpaca, plus fun facts and a photo guessing game to test yourself.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/llama-vs-alpaca" },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/llama-vs-alpaca`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Llama or Alpaca?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/llama-vs-alpaca`,
  image: `${SITE_URL}/og-image.png`,
  author: { "@type": "Person", name: "Steven J. Hubbard" },
  publisher: {
    "@type": "Organization",
    name: "Llama or Alpaca?",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/llamaVectorHead-NoText.png` },
  },
  datePublished: "2026-08-09",
  dateModified: "2026-08-09",
};

export default function LlamaVsAlpacaPage() {
  return (
    <article className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />

      <h1>Llama vs Alpaca: How to Tell the Difference</h1>
      <p className="seo-lead">
        Llamas and alpacas are both South American camelids, both fluffy, and both
        constantly mistaken for each other. But once you know the four tells —
        ears, size, face, and fleece — you&apos;ll never mix them up again. Here&apos;s
        the cheat sheet, then you can{" "}
        <Link href="/">prove it in the guessing game</Link>.
      </p>

      <h2>The quick comparison</h2>
      <div className="seo-table-wrap">
        <table className="seo-table">
          <thead>
            <tr>
              <th></th>
              <th>🦙 Llama</th>
              <th>🦙 Alpaca</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ears</td>
              <td>Long, curved — banana-shaped</td>
              <td>Short, straight, spear-shaped</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>250–450 lb, ~45&quot; at the shoulder</td>
              <td>105–185 lb, ~34–36&quot; at the shoulder</td>
            </tr>
            <tr>
              <td>Face</td>
              <td>Long muzzle, less fuzzy</td>
              <td>Short, smushed, very fuzzy</td>
            </tr>
            <tr>
              <td>Fleece</td>
              <td>Coarse outer coat over softer undercoat</td>
              <td>Fine, soft, luxury-grade fiber</td>
            </tr>
            <tr>
              <td>Personality</td>
              <td>Independent, confident — used as guard animals</td>
              <td>Gentle, shy, happiest in a herd</td>
            </tr>
            <tr>
              <td>Historic job</td>
              <td>Pack animal — can carry 50–75 lb</td>
              <td>Fiber animal — bred for wool</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Ears: the fastest tell</h2>
      <p>
        If you only remember one thing, remember the ears. Llama ears are long and
        curve inward like bananas. Alpaca ears are short, straight little spears.
        In almost any photo where the head is visible, the ears give it away
        instantly — which is exactly why our game gets tricky when the photo
        crops them out.
      </p>

      <h2>Size: llamas are roughly twice as big</h2>
      <p>
        An adult llama typically weighs 250–450 pounds and stands around 45 inches
        at the shoulder. Alpacas are much smaller — usually 105–185 pounds and about
        three feet tall at the shoulder. Standing side by side, there&apos;s no
        contest. In a solo close-up, you&apos;ll need the other tells.
      </p>

      <h2>Face: smushed and fuzzy vs long and proud</h2>
      <p>
        Alpacas have short, blunt faces covered in fluff, which is a big part of
        why the internet finds them so adorable. Llamas have longer muzzles and
        less facial wool — a more &quot;horse-like&quot; profile with an unmistakable
        air of self-importance.
      </p>

      <h2>Fleece: one of these is a luxury fiber</h2>
      <p>
        Alpaca fleece is fine, soft, and hypoallergenic — it&apos;s prized for
        sweaters, scarves, and socks, and often compared to cashmere. Llama fleece
        is a two-layer coat: a coarse outer guard layer over a softer undercoat.
        Great for rugs and rope, less great for your neck.
      </p>

      <h2>Fun facts to win trivia night</h2>
      <ul>
        <li>
          <strong>They&apos;re cousins, not siblings.</strong> Llamas were
          domesticated from guanacos and alpacas from vicuñas, both in the Andes
          thousands of years ago.
        </li>
        <li>
          <strong>They can crossbreed.</strong> A llama-alpaca hybrid is called a
          <em> huarizo</em> — fluffy like an alpaca, sized in between.
        </li>
        <li>
          <strong>Yes, both spit.</strong> Mostly at each other, to settle
          disputes over food or rank. Spitting at humans usually means a very
          annoyed animal.
        </li>
        <li>
          <strong>Llamas guard sheep.</strong>{" "}Farms use llamas as livestock
          guardians — they&apos;ll chase off coyotes and foxes.
        </li>
        <li>
          <strong>Alpacas hum.</strong>{" "}It&apos;s how they talk to the herd. A
          content alpaca sounds like a tiny motor.
        </li>
      </ul>

      <h2>Common questions</h2>
      <div className="seo-faq">
        <h3>Which is friendlier, a llama or an alpaca?</h3>
        <p>
          Alpacas are gentler but shyer — they prefer their herd to people. Llamas
          are more confident and curious, which reads as either friendly or
          judgmental depending on the llama.
        </p>
        <h3>Is alpaca wool better than llama wool?</h3>
        <p>
          For clothing, yes — alpaca fiber is finer, softer, and doesn&apos;t
          contain lanolin, so it&apos;s hypoallergenic. Llama fiber shines for
          heavier-duty textiles.
        </p>
        <h3>Where do llamas and alpacas come from?</h3>
        <p>
          The Andes mountains of South America — mainly Peru, Bolivia, Ecuador,
          and Chile. Peru still has the world&apos;s largest alpaca population.
        </p>
        <h3>Can you keep them together?</h3>
        <p>
          Yes — many farms run mixed herds, and a llama often doubles as the
          guard animal for the alpacas.
        </p>
      </div>

      <div className="seo-cta-row">
        <Link href="/" className="btn-primary">
          🦙 Test yourself: play Llama or Alpaca?
        </Link>
        <a
          href="https://llama-or-alpaca.myspreadshop.com/"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          🛍️ Shop llama &amp; alpaca merch
        </a>
      </div>
    </article>
  );
}
