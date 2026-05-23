"use client";

import { Box, Code2, Cpu, FileCode2, Globe, Printer, RotateCw, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconGitHub } from "../Icons";

interface DisplayCardProps {
  className?: string;
  layoutId?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  image?: string;
  video?: string;
  stack?: string[];
  links?: { code?: string; demo?: string; live?: string; details?: string; drive?: string };
  iconClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
}

interface ProjectMediaProps {
  title: string;
  image?: string;
  video?: string;
  expanded?: boolean;
}

function ProjectMedia({ title, image, video, expanded = false }: ProjectMediaProps) {
  if (video) {
    const previewSrc = expanded ? video : `${video}#t=0.001`;

    return (
      <video
        src={previewSrc}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop={expanded}
        autoPlay={expanded}
        preload={expanded ? "auto" : "metadata"}
        poster={image}
        aria-label={`${title} preview`}
      />
    );
  }

  if (image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={image} alt={title} className="h-full w-full object-cover" />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--elevated)]">
      <Sparkles className="size-8 text-[#68BA7F]" />
    </div>
  );
}

function ProjectLinks({ links }: { links?: DisplayCardProps["links"] }) {
  if (!links || !(links.code || links.demo || links.live || links.details || links.drive)) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap gap-2 pt-3"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {links.code && (
        <a
          href={links.code}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconGitHub />
          GitHub
        </a>
      )}
      {links.demo && (
        <a
          href={links.demo}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          onClick={(e) => e.stopPropagation()}
        >
          Demo -&gt;
        </a>
      )}
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          onClick={(e) => e.stopPropagation()}
        >
          Live -&gt;
        </a>
      )}
      {links.details && (
        <a
          href={links.details}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          onClick={(e) => e.stopPropagation()}
        >
          Details -&gt;
        </a>
      )}
      {links.drive && (
        <a
          href={links.drive}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          onClick={(e) => e.stopPropagation()}
        >
          Drive -&gt;
        </a>
      )}
    </div>
  );
}

const stackIconUrls: Record<string, string> = {
  TypeScript: "https://cdn.simpleicons.org/typescript",
  JavaScript: "https://cdn.simpleicons.org/javascript",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/white",
  Fastify: "https://cdn.simpleicons.org/fastify/white",
  Prisma: "https://cdn.simpleicons.org/prisma/white",
  Playwright: "/icons/playwright.svg",
  SwiftUI: "/icons/swiftui.svg",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs",
  Express: "https://cdn.simpleicons.org/express/white",
  PostgreSQL: "/icons/postgresql.svg",
  Python: "https://cdn.simpleicons.org/python",
  Streamlit: "https://cdn.simpleicons.org/streamlit",
  LangChain: "https://cdn.simpleicons.org/langchain",
  OpenAI: "https://cdn.simpleicons.org/openai/white",
  "OpenAI Vision": "https://cdn.simpleicons.org/openai/white",
  "C++": "https://cdn.simpleicons.org/cplusplus",
  ESP32: "https://cdn.simpleicons.org/espressif",
  PlatformIO: "https://cdn.simpleicons.org/platformio",
  "Fusion 360": "/icons/fusion-360.svg",
  FastAPI: "https://cdn.simpleicons.org/fastapi",
  Celery: "https://cdn.simpleicons.org/celery",
  Redis: "https://cdn.simpleicons.org/redis",
  Vite: "https://cdn.simpleicons.org/vite",
  Kubernetes: "https://cdn.simpleicons.org/kubernetes",
  Docker: "https://cdn.simpleicons.org/docker",
  React: "https://cdn.simpleicons.org/react",
};

function getStackFallbackIcon(stackItem: string) {
  const normalized = stackItem.toLowerCase();

  if (normalized.includes("web")) return <Globe className="size-3.5 text-[#68BA7F]" />;
  if (normalized.includes("dom") || normalized.includes("manifest") || normalized.includes("pdf")) {
    return <FileCode2 className="size-3.5 text-[#4a9960]" />;
  }
  if (normalized.includes("3d") || normalized.includes("print")) {
    return <Printer className="size-3.5 text-[#a8dbb8]" />;
  }
  if (normalized.includes("iteration")) return <RotateCw className="size-3.5 text-[#4a9960]" />;
  if (normalized.includes("esp") || normalized.includes("embedded")) return <Cpu className="size-3.5 text-[#4a9960]" />;
  if (normalized.includes("cad")) return <Box className="size-3.5 text-[#a8dbb8]" />;
  return <Code2 className="size-3.5 text-[#68BA7F]" />;
}

const COMPACT_LIMIT = 4;

function StackChips({ stack, compact = false }: { stack: string[]; compact?: boolean }) {
  if (stack.length === 0) return null;

  const visible = compact ? stack.slice(0, COMPACT_LIMIT) : stack;
  const overflow = compact ? stack.length - COMPACT_LIMIT : 0;

  return (
    <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-2"}`}>
      {visible.map((s) => {
        const iconUrl = stackIconUrls[s];

        return (
          <span
            key={s}
            className="badge inline-flex items-center gap-1"
            style={{ fontSize: compact ? "0.6rem" : "0.7rem", padding: compact ? "1px 5px" : "2px 8px" }}
          >
            <span className="flex size-3.5 flex-shrink-0 items-center justify-center">
              {iconUrl ? (
                <img src={iconUrl} alt="" className="size-3 object-contain" />
              ) : (
                getStackFallbackIcon(s)
              )}
            </span>
            <span>{s}</span>
          </span>
        );
      })}
      {overflow > 0 && (
        <span
          className="badge inline-flex items-center"
          style={{ fontSize: "0.6rem", padding: "1px 5px", opacity: 0.65 }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

function DisplayCard({
  layoutId,
  icon = <Sparkles className="size-4 text-[#68BA7F]" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  image,
  video,
  stack = [],
  links,
  onClick,
}: DisplayCardProps) {
  return (
    <motion.article
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="group relative flex h-full min-h-[390px] cursor-pointer select-none flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] hover:border-[var(--border-glow)]"
      style={{ boxShadow: "var(--shadow-card)" }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div
        className="relative h-[176px] flex-shrink-0 overflow-hidden"
        style={{ background: "var(--elevated)" }}
      >
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <ProjectMedia title={title} image={image} video={video} />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(6,11,18,0.88) 100%)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex-shrink-0 rounded-full bg-[rgba(34,211,238,0.1)] p-1">
            {icon}
          </span>
          <h3
            className="font-display text-sm font-semibold leading-snug"
            style={{
              background: "linear-gradient(135deg, #68BA7F, #4a9960)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h3>
        </div>

        <p
          className="mb-3 line-clamp-4 flex-1 text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>

        {stack.length > 0 && (
          <div className="mb-4">
            <StackChips stack={stack} compact />
          </div>
        )}

        <ProjectLinks links={links} />
      </div>
    </motion.article>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const allCards = cards ?? [];
  const n = allCards.length;

  // tripled array for infinite loop buffer
  const tripled = useMemo(
    () => [...allCards, ...allCards, ...allCards],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n]
  );
  const totalCards = tripled.length; // 3n

  // expandedKey is index into tripled array so layoutId matches
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const expandedOriginalIndex = expandedKey !== null ? expandedKey % n : null;
  const expanded = expandedOriginalIndex !== null ? allCards[expandedOriginalIndex] : null;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(n); // start at index n (first card of middle set)
  const isAnimatingRef = useRef(false);
  const dragStartXRef = useRef<number | null>(null);
  const didDragRef = useRef(false);

  const getCardWidth = useCallback(
    () => (viewportRef.current?.clientWidth ?? 0) / 3,
    []
  );

  const applyTransform = useCallback(
    (pos: number, animated: boolean, extraPx = 0) => {
      if (!trackRef.current) return;
      const cardW = getCardWidth();
      trackRef.current.style.transition = animated
        ? "transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none";
      trackRef.current.style.transform = `translateX(${-pos * cardW + extraPx}px)`;
    },
    [getCardWidth]
  );

  // Set initial position without animation on mount
  useEffect(() => {
    applyTransform(posRef.current, false);
  }, [applyTransform]);

  // Re-apply on resize
  useEffect(() => {
    const onResize = () => applyTransform(posRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyTransform]);

  const navigate = useCallback(
    (direction: 1 | -1, steps = 1) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      posRef.current += direction * steps;
      applyTransform(posRef.current, true);
    },
    [applyTransform]
  );

  const handleTransitionEnd = useCallback(() => {
    isAnimatingRef.current = false;
    // Silently wrap when we drift out of the middle set
    const pos = posRef.current;
    if (pos >= 2 * n) {
      posRef.current = pos - n;
      applyTransform(posRef.current, false);
    } else if (pos < n) {
      posRef.current = pos + n;
      applyTransform(posRef.current, false);
    }
  }, [n, applyTransform]);

  // Global mouse handlers for drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragStartXRef.current === null) return;
      const delta = e.clientX - dragStartXRef.current;
      if (Math.abs(delta) > 5) didDragRef.current = true;
      const cardW = getCardWidth();
      const clamped = Math.max(-cardW * 2, Math.min(cardW * 2, delta));
      applyTransform(posRef.current, false, clamped);
    };

    const onMouseUp = (e: MouseEvent) => {
      if (dragStartXRef.current === null) return;
      const delta = e.clientX - dragStartXRef.current;
      dragStartXRef.current = null;
      setIsDragging(false);

      const cardW = getCardWidth();
      const dir = delta < 0 ? 1 : -1;
      if (Math.abs(delta) > cardW * 1.5) {
        navigate(dir, 2);
      } else if (Math.abs(delta) > 60) {
        navigate(dir, 1);
      } else {
        applyTransform(posRef.current, true);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [applyTransform, navigate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    dragStartXRef.current = e.clientX;
    didDragRef.current = false;
    setIsDragging(true);
  };

  return (
    <>
      <div className="relative">
        {/* Left arrow — sits outside the viewport at -52px */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={() => navigate(-1)}
          aria-label="Previous project"
        >
          ‹
        </button>

        {/* Right arrow — sits outside the viewport at -52px */}
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={() => navigate(1)}
          aria-label="Next project"
        >
          ›
        </button>

        {/* Viewport — clips the track */}
        <div ref={viewportRef} style={{ overflow: "hidden" }}>
          {/* Track — full tripled width, slid by transform */}
          <div
            ref={trackRef}
            className="flex"
            style={{
              width: `${n * 100}%`,
              userSelect: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onTransitionEnd={handleTransitionEnd}
          >
            {tripled.map((cardProps, i) => (
              <div
                key={i}
                style={{
                  width: `${100 / totalCards}%`,
                  padding: "0 10px",
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <DisplayCard
                  {...cardProps}
                  layoutId={`display-card-${i}`}
                  onClick={() => {
                    if (!didDragRef.current) setExpandedKey(i);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded modal — unchanged */}
      <AnimatePresence>
        {expanded && expandedKey !== null && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-md"
              style={{ backgroundColor: "rgba(6,11,18,0.72)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpandedKey(null)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`display-card-${expandedKey}`}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="relative max-h-[92vh] w-[760px] max-w-[94vw] cursor-pointer overflow-y-auto rounded-2xl pointer-events-auto"
                style={{
                  background: "var(--panel)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  boxShadow: "0 30px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(34,211,238,0.08)",
                }}
                onClick={() => setExpandedKey(null)}
              >
                <div className="relative h-[260px] overflow-hidden sm:h-[340px]">
                  <ProjectMedia
                    title={expanded.title ?? "Project"}
                    image={expanded.image}
                    video={expanded.video}
                    expanded
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to bottom, transparent 45%, rgba(6,11,18,0.92) 100%)",
                    }}
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex-shrink-0 rounded-full bg-[rgba(34,211,238,0.1)] p-1">
                      {expanded.icon}
                    </span>
                    <h3
                      className="font-display text-lg font-bold leading-snug sm:text-xl"
                      style={{
                        background: "linear-gradient(135deg, #68BA7F, #4a9960)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {expanded.title}
                    </h3>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {expanded.description}
                  </p>

                  {expanded.stack && expanded.stack.length > 0 && (
                    <div className="mb-4">
                      <StackChips stack={expanded.stack} />
                    </div>
                  )}

                  <ProjectLinks links={expanded.links} />

                  <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)", opacity: 0.4 }}>
                    Click to close
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
