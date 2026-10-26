"use client";

import { useCallback } from "react";

const NOTES = [698.46, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1396.91, 1567.98];

let shared: AudioContext | null = null;
let unlockBound = false;

function audioCtor() {
  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

function getCtx() {
  const AudioCtx = audioCtor();
  if (!AudioCtx) return null;
  if (!shared || shared.state === "closed") {
    shared = new AudioCtx();
  }
  return shared;
}

function bindUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;
  const unlock = () => {
    const ctx = getCtx();
    if (ctx?.state === "suspended") void ctx.resume();
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export function useWhimsyAudio() {
  const play = useCallback(async (index: number) => {
    bindUnlock();
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }
    if (ctx.state !== "running") return;

    const freq = NOTES[index % NOTES.length] ?? NOTES[0];
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
    master.connect(ctx.destination);

    const bell = ctx.createOscillator();
    bell.type = "sine";
    bell.frequency.setValueAtTime(freq, now);

    const fifth = ctx.createOscillator();
    fifth.type = "sine";
    fifth.frequency.setValueAtTime(freq * 1.5, now);
    const fifthGain = ctx.createGain();
    fifthGain.gain.value = 0.08;

    const sparkle = ctx.createOscillator();
    sparkle.type = "triangle";
    sparkle.frequency.setValueAtTime(freq * 2.02, now);
    sparkle.frequency.exponentialRampToValueAtTime(freq * 2.6, now + 0.18);
    const sparkleGain = ctx.createGain();
    sparkleGain.gain.value = 0.06;

    bell.connect(master);
    fifth.connect(fifthGain).connect(master);
    sparkle.connect(sparkleGain).connect(master);
    bell.start(now);
    fifth.start(now);
    sparkle.start(now);
    bell.stop(now + 0.62);
    fifth.stop(now + 0.42);
    sparkle.stop(now + 0.28);
  }, []);

  return { play };
}
