"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NOTES = [523.25, 587.33, 659.25, 783.99, 880.0];

export function useWindchimeAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state !== "closed") {
        void ctx.close();
      }
    };
  }, []);

  const ensure = useCallback(async () => {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === "suspended") {
      await ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const ring = useCallback(
    async (index: number, velocity = 1) => {
      if (mutedRef.current) return;
      const ctx = await ensure();
      if (!ctx) return;

      const freq = NOTES[index] ?? NOTES[0];
      const now = ctx.currentTime;
      const duration = 2.1;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.22 * velocity, now + 0.018);
      master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      master.connect(ctx.destination);

      const fundamental = ctx.createOscillator();
      fundamental.type = "sine";
      fundamental.frequency.setValueAtTime(freq, now);

      const partial = ctx.createOscillator();
      partial.type = "triangle";
      partial.frequency.setValueAtTime(freq * 2.003, now);
      const partialGain = ctx.createGain();
      partialGain.gain.value = 0.11;

      const shimmer = ctx.createOscillator();
      shimmer.type = "sine";
      shimmer.frequency.setValueAtTime(freq * 2.76, now);
      const shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0.05;

      fundamental.connect(master);
      partial.connect(partialGain).connect(master);
      shimmer.connect(shimmerGain).connect(master);

      fundamental.start(now);
      partial.start(now);
      shimmer.start(now);
      fundamental.stop(now + duration);
      partial.stop(now + duration);
      shimmer.stop(now + duration);
    },
    [ensure],
  );

  const unlockAndRing = useCallback(
    async (index: number) => {
      if (mutedRef.current) {
        mutedRef.current = false;
        setMuted(false);
      }
      await ring(index, 1);
    },
    [ring],
  );

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      return next;
    });
  }, []);

  return { muted, ring, unlockAndRing, toggleMute };
}
