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

// ---------- Story ----------

// EDIT ME — rewrite these chapters to be your story.
const CHAPTERS: { title: string; emoji: string; text: string }[] = [
  {
    title: "Chapter 1 — Once upon a swipe",
    emoji: "🌸",
    text:
      "Once upon a time, in a world full of ordinary days, there was a boy who couldn't stop thinking about a girl. He didn't know it yet, but his whole life was about to get a little softer, a little louder, and a lot more pink.",
  },
  {
    title: "Chapter 2 — The first 'hi'",
    emoji: "💌",
    text:
      "The first 'hi' felt like nothing. The second one felt like something. By the third, the boy was rereading every message three times and smiling at his phone like an idiot. (He still does, by the way.)",
  },
  {
    title: "Chapter 3 — Our little universe",
    emoji: "🌍",
    text:
      "Slowly, we built a tiny universe — inside jokes nobody else gets, songs that only mean something to us, that one mall, that one walk, that one night. Home stopped being a place. It started being you.",
  },
  {
    title: "Chapter 4 — Every storm, together",
    emoji: "☔",
    text:
      "Not every page was sunshine. There were rainy chapters too — but every time it stormed, we just held hands a little tighter. Turns out, the rain is kind of nice when it's with you.",
  },
  {
    title: "Chapter 5 — Right now",
    emoji: "💗",
    text:
      "Which brings us to today. You, reading this. Me, somewhere nervously waiting to see your face. And a story that doesn't want to end. So… one tiny question on the next page.",
  },
];

function StoryGame() {
  const [page, setPage] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [noNudge, setNoNudge] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const total = CHAPTERS.length;
  const isQuestion = page === total;
  const progress = ((Math.min(page, total) + (isQuestion ? 1 : 0)) / (total + 1)) * 100;

  const next = () => {
    setPage((p) => p + 1);
    setTimeout(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  const sayYes = () => {
    setAnswered(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 8000);
  };

  const dodgeNo = () => setNoNudge((n) => n + 1);

  // Pseudo-random dodge position based on click count
  const dodgeStyle = useMemo(() => {
    const x = Math.sin(noNudge * 7.3) * 120;
    const y = Math.cos(noNudge * 4.7) * 40;
    const r = Math.sin(noNudge) * 12;
    return {
      transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
      transition: "transform 250ms cubic-bezier(.2,.9,.3,1.4)",
    } as const;
  }, [noNudge]);

  return (
    <section ref={stageRef} className="relative z-10 mx-auto max-w-2xl px-4 py-16">
      {/* progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {Math.min(page + 1, total + 1)} / {total + 1}
        </span>
      </div>

      {!isQuestion && (
        <SoftCard key={page} className="animate-slide-up text-center">
          <div className="text-6xl">{CHAPTERS[page].emoji}</div>
          <h2 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
            {CHAPTERS[page].title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-foreground/85">
            {CHAPTERS[page].text}
          </p>
          <div className="mt-8">
            <CuteButton onClick={next}>
              {page === total - 1 ? "Turn the page… 💖" : "Next page →"}
            </CuteButton>
          </div>
        </SoftCard>
      )}

      {isQuestion && !answered && (
        <SoftCard className="animate-slide-up text-center">
          <div className="animate-pulse-heart text-7xl">💍</div>
          <h2 className="text-shimmer mt-4 text-5xl font-bold sm:text-6xl">
            Will you be mine, forever?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            (One tiny answer. The rest of our story depends on it 💗)
          </p>
          <div className="relative mt-10 flex items-center justify-center gap-4">
            <CuteButton onClick={sayYes} className="text-lg">
              Yes, a thousand times 💖
            </CuteButton>
            <button
              onMouseEnter={dodgeNo}
              onFocus={dodgeNo}
              onClick={dodgeNo}
              style={dodgeStyle}
              className="rounded-full border border-border bg-white/70 px-6 py-3 text-sm text-muted-foreground"
            >
              {noNudge > 3 ? "you can't catch me 😅" : "No"}
            </button>
          </div>
        </SoftCard>
      )}

      {answered && (
        <>
          {confetti && <Confetti />}
          <SoftCard className="animate-slide-up text-center">
            <div className="text-7xl">🎉</div>
            <h2 className="text-shimmer mt-4 text-5xl font-bold sm:text-6xl">
              She said YES 💕
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-foreground/85">
              Best plot twist ever. Now come here so I can hug you — the next chapter starts today,
              and I can't wait to write all of it with you.
            </p>
            <p className="mt-6 text-2xl">— Forever yours 💖</p>
          </SoftCard>
        </>
      )}
    </section>
  );
}

function Index() {
  const stageRef = useRef<HTMLElement>(null);
  const start = () => stageRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="relative min-h-screen">
      <FloatingHearts />
      <MusicToggle />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-pulse-heart text-6xl sm:text-7xl">💖</div>
        <h1 className="text-shimmer mt-4 text-6xl font-bold leading-tight sm:text-8xl">
          A Little Story
        </h1>
        <p className="mt-4 max-w-xl text-lg text-foreground/80 sm:text-2xl">
          Made just for you. Press start, follow along, and stay till the last page 💕
        </p>
        <button
          onClick={start}
          className="animate-wiggle mt-10 rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-[0_12px_30px_-8px_oklch(0.72_0.14_350/0.7)] transition hover:scale-110"
        >
          ▶ Press Start
        </button>
        <p className="mt-16 animate-bounce text-2xl">↓</p>
      </section>

      <section ref={stageRef as React.RefObject<HTMLElement>}>
        <StoryGame />
      </section>

      <footer className="relative z-10 pb-8 text-center text-sm text-muted-foreground">
        Made with 💖 just for you
      </footer>
    </main>
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

