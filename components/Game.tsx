"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "./SoundProvider";

type GameImage = {
  id: string;
  url: string;
  species: "llama" | "alpaca";
  attribution_name: string | null;
  attribution_url: string | null;
  license: string | null;
};

type Mode = "classic" | "blitz";

const FACTS: Record<"llama" | "alpaca", string[]> = {
  llama: [
    "Llamas have long, banana-shaped ears that curve inward at the tip.",
    "Llamas usually have a longer face and snout than alpacas.",
    "Llamas are taller and leaner — bred as pack animals.",
    "A llama's coat is coarser and straighter than an alpaca's.",
    "Llamas can weigh up to 400 lbs — much bigger than alpacas.",
  ],
  alpaca: [
    "Alpacas have short, spear-shaped ears — much smaller than a llama's.",
    "Alpacas have round, fluffy “teddy bear” faces.",
    "Alpacas are shorter and stockier — bred mainly for their fleece.",
    "An alpaca's fleece is dense and extra-soft, prized for fiber.",
    "Alpacas top out around 150–180 lbs, about half a llama's size.",
  ],
};

const STORAGE_KEY = "loa_scores_v2";
const SEEN_HOWTO_KEY = "loa_seen_howto_v1";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function loadScores(): { classic: number; blitz: number } {
  if (typeof window === "undefined") return { classic: 0, blitz: 0 };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") ?? { classic: 0, blitz: 0 };
  } catch {
    return { classic: 0, blitz: 0 };
  }
}

let audioCtx: AudioContext | null = null;
function tone(soundOn: boolean, freq: number, duration: number, type: OscillatorType = "sine", startGain = 0.16) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(startGain, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    /* audio unsupported, ignore */
  }
}

// A cartoon llama-spit "pfft-pfft-pt!" - a few short filtered noise bursts
// with a final lower splat, rather than a literal recording (keeps the game
// dependency-free and avoids sourcing/licensing a real animal sound clip).
function playSpitSound(soundOn: boolean) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    const bursts = [
      { start: 0, dur: 0.05, freq: 520, q: 3, gain: 0.22 },
      { start: 0.05, dur: 0.045, freq: 430, q: 3, gain: 0.2 },
      { start: 0.09, dur: 0.04, freq: 480, q: 4, gain: 0.18 },
      { start: 0.125, dur: 0.17, freq: 210, q: 1.3, gain: 0.3 },
    ];

    for (const { start, dur, freq, q, gain } of bursts) {
      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = freq;
      filter.Q.value = q;

      const env = ctx.createGain();
      const t0 = now + start;
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.linearRampToValueAtTime(gain, t0 + Math.min(0.01, dur / 4));
      env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

      noise.connect(filter);
      filter.connect(env);
      env.connect(ctx.destination);

      noise.start(t0);
      noise.stop(t0 + dur + 0.02);
    }
  } catch {
    /* audio unsupported, ignore */
  }
}

// A bright, bouncy major-key arpeggio for a correct guess.
function playCorrectSound(soundOn: boolean) {
  if (!soundOn) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => tone(soundOn, freq, 0.18, "triangle", 0.2), i * 65);
  });
}

function burstConfetti() {
  const colors = ["#e8823c", "#6aa9a0", "#f4c95d", "#e85c5c", "#7fc2b8"];
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = rand(5, 95) + "vw";
    piece.style.background = pick(colors);
    piece.style.animationDuration = rand(1.6, 2.6) + "s";
    piece.style.transform = `rotate(${randInt(0, 360)}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2700);
  }
}

async function fetchBatch(): Promise<{ images: GameImage[]; available: number }> {
  const res = await fetch("/api/game/round", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load photos.");
  return res.json();
}

export default function Game() {
  const { soundOn } = useSound();
  const [screen, setScreen] = useState<"mode" | "game" | "results">("mode");
  const [mode, setMode] = useState<Mode>("classic");
  const [scores, setScores] = useState({ classic: 0, blitz: 0 });
  const [showHowTo, setShowHowTo] = useState(false);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);
  const [shake, setShake] = useState(false);
  const [fact, setFact] = useState<string | null>(null);
  const [current, setCurrent] = useState<GameImage | null>(null);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [notEnough, setNotEnough] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const batchRef = useRef<GameImage[]>([]);
  const batchIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef<Mode>("classic");
  const timeLeftRef = useRef(60);

  useEffect(() => {
    setScores(loadScores());
    if (!localStorage.getItem(SEEN_HOWTO_KEY)) {
      setShowHowTo(true);
      localStorage.setItem(SEEN_HOWTO_KEY, "1");
    }
  }, []);

  function saveScores(next: { classic: number; blitz: number }) {
    setScores(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function ensureBatch(): Promise<boolean> {
    setLoadingBatch(true);
    try {
      const { images, available } = await fetchBatch();
      if (images.length < 2 || available < 4) {
        setNotEnough(true);
        return false;
      }
      setNotEnough(false);
      batchRef.current = images;
      batchIndexRef.current = 0;
      return true;
    } catch {
      setNotEnough(true);
      return false;
    } finally {
      setLoadingBatch(false);
    }
  }

  async function nextRound() {
    if (batchIndexRef.current >= batchRef.current.length) {
      const ok = await ensureBatch();
      if (!ok) return;
    }
    const img = batchRef.current[batchIndexRef.current];
    batchIndexRef.current += 1;
    setCurrent(img);
    setFact(null);
    setLocked(false);
    setFeedback(null);
  }

  async function startGame(m: Mode) {
    modeRef.current = m;
    setMode(m);
    setScore(0);
    setLocked(false);
    setFact(null);
    setFeedback(null);
    setNewBest(false);
    const initialTime = 60;
    setTimeLeft(initialTime);
    timeLeftRef.current = initialTime;
    setScreen("game");

    const ok = await ensureBatch();
    if (ok) await nextRound();

    if (timerRef.current) clearInterval(timerRef.current);
    if (m === "blitz") {
      timerRef.current = setInterval(() => {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);
        if (timeLeftRef.current <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          endGame(true);
        }
      }, 1000);
    }
  }

  function endGame(showResults: boolean) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!showResults) {
      setScreen("mode");
      return;
    }
    const m = modeRef.current;
    setScore((currentScore) => {
      const prevBest = scores[m] || 0;
      const isNew = currentScore > prevBest;
      setNewBest(isNew);
      setFinalScore(currentScore);
      if (isNew) {
        saveScores({ ...scores, [m]: currentScore });
        if (currentScore > 0) burstConfetti();
      }
      return currentScore;
    });
    setScreen("results");
  }

  function submitGuess(guess: "llama" | "alpaca") {
    if (locked || !current) return;
    setLocked(true);
    const correct = guess === current.species;
    setFact(pick(FACTS[current.species]));

    if (correct) {
      setScore((s) => {
        const next = s + 1;
        if (modeRef.current === "classic" && next > 0 && next % 5 === 0) {
          tone(soundOn, 523.25, 0.22);
          setTimeout(() => tone(soundOn, 659.25, 0.22), 100);
          setTimeout(() => tone(soundOn, 783.99, 0.22), 200);
          setTimeout(() => tone(soundOn, 1046.5, 0.22), 300);
          burstConfetti();
        }
        return next;
      });
      playCorrectSound(soundOn);
      setFeedback("good");
    } else {
      playSpitSound(soundOn);
      setFeedback("bad");
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }

    setTimeout(() => {
      if (!correct && modeRef.current === "classic") {
        endGame(true);
        return;
      }
      if (modeRef.current === "blitz" && timeLeftRef.current <= 0) return;
      nextRound();
    }, 1100);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showHowTo) {
        if (e.key === "Escape" || e.key === "Enter") setShowHowTo(false);
        return;
      }
      if (screen === "game") {
        if (e.key.toLowerCase() === "l") submitGuess("llama");
        if (e.key.toLowerCase() === "a") submitGuess("alpaca");
        if (e.key === "Escape") endGame(false);
      } else if (screen === "results" && e.key === "Enter") {
        startGame(modeRef.current);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      {screen === "mode" && (
        <section className="panel mode-select">
          <div className="hero-mascot-wrap" aria-hidden="true">
            <span className="hero-sparkle hero-sparkle-1">✨</span>
            <span className="hero-sparkle hero-sparkle-2">🌿</span>
            <span className="hero-sparkle hero-sparkle-3">☁️</span>
            <svg className="hero-mascot" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="32" fill="#f4a259" />
              <ellipse cx="32" cy="30" rx="15" ry="17" fill="#f6e8cf" />
              <path d="M14 24 C10 14, 14 4, 22 10 C24 16, 22 22, 18 26 Z" fill="#f6e8cf" />
              <path d="M50 24 C54 14, 50 4, 42 10 C40 16, 42 22, 46 26 Z" fill="#f6e8cf" />
              <circle cx="26" cy="29" r="2.6" fill="#2b2118" />
              <circle cx="38" cy="29" r="2.6" fill="#2b2118" />
              <ellipse cx="32" cy="37" rx="5" ry="3.4" fill="#e9d3a8" />
            </svg>
          </div>

          <h1 className="hero-in hero-in-1">
            Llama <span className="or">or</span> Alpaca?
          </h1>
          <p className="tagline hero-in hero-in-2">Real photos. Can you tell them apart?</p>

          <div className="mode-cards hero-in hero-in-3">
            <button className="mode-card" onClick={() => startGame("classic")}>
              <span className="mode-icon">🔥</span>
              <span className="mode-title">Streak</span>
              <span className="mode-desc">One mistake ends it. How far can you go?</span>
              <span className="mode-best">Best: {scores.classic}</span>
            </button>
            <button className="mode-card" onClick={() => startGame("blitz")}>
              <span className="mode-icon">⚡</span>
              <span className="mode-title">Blitz</span>
              <span className="mode-desc">60 seconds. As many correct as you can.</span>
              <span className="mode-best">Best: {scores.blitz}</span>
            </button>
          </div>

          <button className="howto-cta hero-in hero-in-4" onClick={() => setShowHowTo(true)}>
            <span className="howto-cta-icon">🦙🔍🐑</span>
            <span className="howto-cta-text">
              <strong>Can you tell them apart?</strong>
              <span>Ears, face shape, build &amp; coat — a quick visual guide</span>
            </span>
            <span className="howto-cta-arrow">→</span>
          </button>

          <p className="mode-note hero-in hero-in-5">Got a great llama or alpaca photo? Sign up and upload it to the game.</p>
        </section>
      )}

      {screen === "game" && (
        <section className="panel game-screen">
          <div className="hud">
            <div className="hud-chip">
              <span className="chip-label">{mode === "blitz" ? "Score" : "Streak"}</span>
              <span className="chip-value">{score}</span>
            </div>
            {mode === "blitz" && (
              <div className={"hud-chip hud-timer" + (timeLeft <= 10 ? " low" : "")}>
                <span className="chip-label">Time</span>
                <span className="chip-value">{timeLeft}</span>
              </div>
            )}
            <button className="quit-btn" aria-label="Quit to menu" onClick={() => endGame(false)}>
              ✕
            </button>
          </div>

          <div className="card-wrap">
            <div className={"creature-card" + (shake ? " shake" : "")}>
              {notEnough ? (
                <div className="empty-state">
                  Not enough approved photos yet.
                  <br />
                  Ask an admin to seed or approve some!
                </div>
              ) : loadingBatch || !current ? (
                <div className="empty-state">Loading photos…</div>
              ) : (
                <div className="creature-frame pop" key={current.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={current.url} alt="Guess: llama or alpaca?" />
                  {current.attribution_name && (
                    <div className="attribution">
                      {current.attribution_url ? (
                        <a href={current.attribution_url} target="_blank" rel="noreferrer">
                          Photo: {current.attribution_name}
                        </a>
                      ) : (
                        <span>Photo: {current.attribution_name}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className={"feedback-banner" + (feedback === "good" ? " show-good" : feedback === "bad" ? " show-bad" : "")}>
                {feedback === "good" ? "Nice! ✓" : feedback === "bad" ? "Oops ✗" : ""}
              </div>
            </div>
          </div>

          <div className="fact-box" style={{ visibility: fact ? "visible" : "hidden" }}>
            <span className="fact-label">Tip</span>
            <span>{fact}</span>
          </div>

          <div className="choice-row">
            <button className="choice-btn choice-llama" disabled={locked || notEnough} onClick={() => submitGuess("llama")}>
              <span className="choice-emoji">🦙</span> Llama
              <kbd>L</kbd>
            </button>
            <button className="choice-btn choice-alpaca" disabled={locked || notEnough} onClick={() => submitGuess("alpaca")}>
              <span className="choice-emoji">🐑</span> Alpaca
              <kbd>A</kbd>
            </button>
          </div>
        </section>
      )}

      {screen === "results" && (
        <section className="panel results-screen">
          <div className="results-emoji">{newBest ? "🏆" : finalScore === 0 ? "🦔" : "🎉"}</div>
          <h2>{newBest ? "New best!" : "Round over!"}</h2>
          <div className="results-stats">
            <div className="stat">
              <span className="stat-value">{finalScore}</span>
              <span className="stat-label">{mode === "blitz" ? "Score" : "Streak"}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{Math.max(finalScore, scores[mode] || 0)}</span>
              <span className="stat-label">Best</span>
            </div>
          </div>
          {newBest && <p className="results-new-best">✨ New personal best! ✨</p>}
          <div className="results-actions">
            <button className="btn-primary" onClick={() => startGame(mode)}>
              Play again
            </button>
            <button className="btn-secondary" onClick={() => setScreen("mode")}>
              Menu
            </button>
          </div>
        </section>
      )}

      {showHowTo && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowHowTo(false)}>
          <div className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" aria-label="Close" onClick={() => setShowHowTo(false)}>
              ✕
            </button>
            <h2>How to tell them apart</h2>
            <div className="howto-grid">
              <div className="howto-col">
                <div className="howto-heading">🦙 Llama</div>
                <ul>
                  <li>Long, banana-shaped ears that curve inward</li>
                  <li>Longer face and snout</li>
                  <li>Taller, leaner build</li>
                  <li>Straighter, coarser coat</li>
                </ul>
              </div>
              <div className="howto-col">
                <div className="howto-heading">🐑 Alpaca</div>
                <ul>
                  <li>Short, spear-shaped ears</li>
                  <li>Round, fluffy &quot;teddy bear&quot; face</li>
                  <li>Shorter, stockier build</li>
                  <li>Dense, extra-fluffy fleece</li>
                </ul>
              </div>
            </div>
            <p className="howto-footer">
              Tap Llama or Alpaca (or press <kbd>L</kbd> / <kbd>A</kbd>) as fast as you can. Streak mode ends on
              your first miss — Blitz gives you 60 seconds to rack up points.
            </p>
            <button className="btn-primary" id="howToStart" onClick={() => setShowHowTo(false)}>
              Got it, let&apos;s play
            </button>
          </div>
        </div>
      )}
    </>
  );
}
