"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const SOUND_KEY = "loa_sound_v1";

let audioCtx: AudioContext | null = null;
function chime(freq: number, duration: number) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    /* audio unsupported, ignore */
  }
}

type SoundContextValue = {
  soundOn: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(localStorage.getItem(SOUND_KEY) !== "off");
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((s) => {
      const next = !s;
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      if (next) chime(660, 0.08);
      return next;
    });
  }, []);

  return <SoundContext.Provider value={{ soundOn, toggleSound }}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
