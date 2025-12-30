"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SoundType = "drop" | "win" | "draw" | "click";

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Check if mute preference is saved in localStorage
    const savedMuteState = localStorage.getItem("soundMuted");
    if (savedMuteState !== null) {
      setIsMuted(savedMuteState === "true");
    }

    // Initialize AudioContext on user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    window.addEventListener("click", initAudioContext, { once: true });
    window.addEventListener("touchstart", initAudioContext, { once: true });

    return () => {
      window.removeEventListener("click", initAudioContext);
      window.removeEventListener("touchstart", initAudioContext);
    };
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (isMuted || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [isMuted]
  );

  const playSound = useCallback(
    (sound: SoundType) => {
      if (isMuted) return;

      switch (sound) {
        case "drop":
          // Falling pitch for piece drop
          playTone(800, 0.1, "sine");
          setTimeout(() => playTone(400, 0.1, "sine"), 50);
          break;

        case "win":
          // Victory fanfare
          playTone(523, 0.15, "triangle"); // C
          setTimeout(() => playTone(659, 0.15, "triangle"), 150); // E
          setTimeout(() => playTone(784, 0.3, "triangle"), 300); // G
          break;

        case "draw":
          // Neutral sound
          playTone(400, 0.2, "sine");
          setTimeout(() => playTone(350, 0.2, "sine"), 200);
          break;

        case "click":
          // Quick click sound
          playTone(600, 0.05, "square");
          break;
      }
    },
    [isMuted, playTone]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem("soundMuted", String(newState));
      return newState;
    });
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute,
  };
}
