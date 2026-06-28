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

// ---------- Levels ----------

function Level1({ onPass }: { onPass: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = 0; // EDIT ME
  const options = [
    "The way it actually happened ✨", // EDIT ME — set correct index
    "At a coffee shop ☕",
    "Through a mutual friend 🤝",
    "In a dream 💭",
  ];
  return (
    <div className="space-y-5">
      <p className="text-lg text-muted-foreground">How did we first meet?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o, i) => {
          const isPicked = picked === i;
          const isRight = picked !== null && i === correct;
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className={`rounded-2xl border-2 px-5 py-4 text-left transition-all hover:-translate-y-0.5 ${
                isRight
                  ? "border-primary bg-primary/10"
                  : isPicked
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-border bg-white/70"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked === correct && (
        <div className="animate-slide-up flex flex-col items-start gap-3">
          <p className="text-primary">Yes! That's our story 💕</p>
          <CuteButton onClick={onPass}>Next level →</CuteButton>
        </div>
      )}
    </div>
  );
}

function Level2({ onPass }: { onPass: () => void }) {
  // EDIT ME — replace src with your photos in /public or src/assets
  const memories = [
    { caption: "Our first trip together 🌊", emoji: "🏖️" },
    { caption: "That cozy rainy night 🌧️", emoji: "☕" },
    { caption: "Dancing in the kitchen 💃", emoji: "🎶" },
    { caption: "Sunset we still talk about 🌅", emoji: "🌇" },
  ];
  return (
    <div className="space-y-5">
      <p className="text-lg text-muted-foreground">A few of my favorite frames of us…</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {memories.map((m, i) => (
          <div
            key={i}
            className="animate-slide-up group overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-md"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="grid aspect-square place-items-center bg-gradient-to-br from-pink-100 to-purple-100 text-5xl transition group-hover:scale-110">
              {m.emoji}
            </div>
            <p className="p-3 text-center text-sm">{m.caption}</p>
          </div>
        ))}
      </div>
      <CuteButton onClick={onPass}>Aww, next →</CuteButton>
    </div>
  );
}

function Level3({ onPass }: { onPass: () => void }) {
  const [val, setVal] = useState("");
  const [tried, setTried] = useState(false);
  const answer = "pineapple"; // EDIT ME — your inside-joke answer
  const correct = val.trim().toLowerCase() === answer.toLowerCase();
  return (
    <div className="space-y-5">
      <p className="text-lg text-muted-foreground">
        Inside joke time — what's the one word only YOU would say here? 😏
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="type your answer…"
          className="flex-1 rounded-full border-2 border-border bg-white/80 px-5 py-3 outline-none focus:border-primary"
        />
        <CuteButton onClick={() => setTried(true)} variant="ghost">
          Check 💘
        </CuteButton>
      </div>
      {tried && !correct && <p className="text-destructive">Hmm, try again, cutie 😘</p>}
      {correct && (
        <div className="animate-slide-up flex flex-col items-start gap-3">
          <p className="text-primary">Only you would know that 💗</p>
          <CuteButton onClick={onPass}>Next level →</CuteButton>
        </div>
      )}
    </div>
  );
}

function Level4({ onPass }: { onPass: () => void }) {
  const dreams = [
    { label: "Travel the world", emoji: "✈️" },
    { label: "Our little home", emoji: "🏡" },
    { label: "A fluffy pet", emoji: "🐶" },
    { label: "Tiny adventures", emoji: "🧺" },
    { label: "Cooking together", emoji: "🍝" },
    { label: "Growing old, hand in hand", emoji: "👵👴" },
  ];
  const [picked, setPicked] = useState<number[]>([]);
  const toggle = (i: number) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  return (
    <div className="space-y-5">
      <p className="text-lg text-muted-foreground">Pick all the futures you want with me 💭</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {dreams.map((d, i) => {
          const on = picked.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`rounded-2xl border-2 p-4 text-center transition-all hover:-translate-y-1 ${
                on ? "border-primary bg-primary/15 scale-105" : "border-border bg-white/70"
              }`}
            >
              <div className="text-3xl">{d.emoji}</div>
              <div className="mt-1 text-sm font-medium">{d.label}</div>
            </button>
          );
        })}
      </div>
      {picked.length >= 3 && (
        <div className="animate-slide-up">
          <CuteButton onClick={onPass}>Complete the game 💖</CuteButton>
        </div>
      )}
    </div>
  );
}

function Index() {
  const [level, setLevel] = useState(1);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  const scrollToGame = () => gameRef.current?.scrollIntoView({ behavior: "smooth" });

  const advance = () => {
    if (level < 4) setLevel((l) => l + 1);
    else {
      setDone(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 6000);
      setTimeout(() => finaleRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  };

  const years = [
    { y: "Year 1", c: "Where it all began — first dates, first 'I love you's. 💌" },
    { y: "Year 2", c: "We built our little world, inside jokes and all. 🌍" },
    { y: "Year 3", c: "Through every up and down, we chose each other. 🤍" },
    { y: "Year 4", c: "Stronger, softer, and somehow more in love. 💞" },
  ];

  return (
    <main className="relative min-h-screen">
      <FloatingHearts />
      {confetti && <Confetti />}
      <MusicToggle />

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-pulse-heart text-6xl sm:text-7xl">💖</div>
        <h1 className="text-shimmer mt-4 text-6xl font-bold leading-tight sm:text-8xl">
          Level 4 Unlocked
        </h1>
        <p className="mt-4 max-w-xl text-lg text-foreground/80 sm:text-2xl">
          4 years of love, laughter, and us.
        </p>
        <button
          onClick={scrollToGame}
          className="animate-wiggle mt-10 rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-[0_12px_30px_-8px_oklch(0.72_0.14_350/0.7)] transition hover:scale-110"
        >
          ▶ Press Start
        </button>
        <p className="mt-16 animate-bounce text-2xl">↓</p>
      </section>

      {/* Game */}
      <section
        ref={gameRef}
        className="relative z-10 mx-auto max-w-3xl px-4 py-20"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-4xl font-bold sm:text-5xl">Level {level}</h2>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={`h-3 w-8 rounded-full transition ${
                  n <= level ? "bg-primary" : "bg-primary/20"
                }`}
              />
            ))}
          </div>
        </div>
        <SoftCard className="animate-slide-up">
          <h3 className="mb-4 text-3xl font-bold text-primary">
            {["Our First Meeting", "Our Memories", "Inside Jokes", "Future Us"][level - 1]}
          </h3>
          {level === 1 && <Level1 onPass={advance} />}
          {level === 2 && <Level2 onPass={advance} />}
          {level === 3 && <Level3 onPass={advance} />}
          {level === 4 && <Level4 onPass={advance} />}
        </SoftCard>
      </section>

      {/* Finale */}
      {done && (
        <section ref={finaleRef} className="relative z-10 mx-auto max-w-3xl px-4 py-20">
          <SoftCard className="animate-slide-up text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="text-shimmer mt-3 text-5xl font-bold sm:text-6xl">
              You've completed 4 Years of Us 💕
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Game cleared. Heart still racing.
            </p>
          </SoftCard>
        </section>
      )}

      {/* Love Letter */}
      <section className="relative z-10 mx-auto max-w-2xl px-4 py-16">
        <SoftCard className="relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-7xl opacity-20">💌</div>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            To My Forever Player 2
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="mt-5 min-h-32 whitespace-pre-wrap rounded-2xl bg-white/60 p-5 text-lg leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
          >
            {`My love,\n\nFour years ago you walked into my world and rewrote every page. Every quiet morning, every silly fight, every late-night laugh — they're all my favorite. You make ordinary days feel like little miracles. Thank you for choosing me, every single day.\n\nForever yours,\n[your name] 💖`}
          </p>
          <p className="mt-3 text-xs italic text-muted-foreground">
            (Tap the letter to edit — write your own little novel 💗)
          </p>
        </SoftCard>
      </section>

      {/* Timeline */}
      <section className="relative z-10 px-4 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold sm:text-5xl">Our Timeline</h2>
        <div className="mx-auto max-w-6xl overflow-x-auto pb-4">
          <div className="flex min-w-max gap-6 px-2">
            {years.map((y, i) => (
              <div
                key={y.y}
                className="w-72 shrink-0 animate-slide-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <SoftCard className="h-full">
                  <div className="text-4xl">{["🌱", "🌸", "🌷", "🌹"][i]}</div>
                  <h3 className="mt-2 text-3xl font-bold text-primary">{y.y}</h3>
                  <p className="mt-2 text-foreground/80">{y.c}</p>
                </SoftCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final surprise */}
      <section className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center">
        {!surprise ? (
          <CuteButton onClick={() => setSurprise(true)} className="text-lg">
            One More Surprise 💌
          </CuteButton>
        ) : (
          <SoftCard className="animate-slide-up">
            <div className="text-6xl">💍</div>
            <h2 className="text-shimmer mt-3 text-4xl font-bold sm:text-5xl">
              Will you continue to Level 5 with me?
            </h2>
            <div className="mt-6 flex justify-center gap-3">
              <CuteButton>Yes 💖</CuteButton>
              <CuteButton
                variant="ghost"
                onClick={(): void => {
                  // playful — the button runs away
                }}
                className="hover:translate-x-10"
              >
                Also yes 😅
              </CuteButton>
            </div>
          </SoftCard>
        )}
      </section>

      <footer className="relative z-10 pb-8 text-center text-sm text-muted-foreground">
        Made with 💖 for us — {new Date().getFullYear()}
      </footer>
    </main>
  );
}
