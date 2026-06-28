import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Story For You 💖" },
      { name: "description", content: "A tiny story-game made just for you — press start and follow along." },
      { property: "og:title", content: "A Little Story For You 💖" },
      { property: "og:description", content: "Press start. Follow the story. Answer one tiny question at the end." },
    ],
  }),
  component: Index,
});

const HEARTS = ["💖", "💕", "💗", "🌸", "✨", "💞"];

function FloatingHearts() {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 10,
        size: 14 + Math.random() * 22,
        emoji: HEARTS[i % HEARTS.length],
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((h) => (
        <span
          key={h.id}
          className="animate-float-up absolute"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        color: ["#ffb6c1", "#dda0dd", "#fff1c1", "#ffc8dd", "#cdb4db"][i % 5],
        rotate: Math.random() * 360,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="animate-confetti absolute top-0 block h-3 w-2 rounded-sm"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-md sm:p-10 ${className}`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {children}
    </div>
  );
}

function CuteButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.72_0.14_350/0.6)] hover:shadow-[0_12px_30px_-8px_oklch(0.72_0.14_350/0.8)]"
      : "bg-white/70 text-foreground border border-primary/30 backdrop-blur";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio(
      "https://cdn.pixabay.com/audio/2022/10/30/audio_347f3ff2a9.mp3",
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);
  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle music"
      className="fixed right-4 top-4 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/80 text-xl shadow-lg backdrop-blur transition hover:scale-110"
    >
      {playing ? "🔊" : "🔈"}
    </button>
  );
}

