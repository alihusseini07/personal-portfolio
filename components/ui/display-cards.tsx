"use client";

import { cn } from "../../lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DisplayCardProps {
  className?: string;
  layoutId?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  image?: string;
  stack?: string[];
  links?: { code?: string; live?: string; details?: string; drive?: string };
  iconClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
  isHidden?: boolean;
}

// Stack position classes — baked in here so page.tsx stays clean.
// index 0 = backmost (leftmost in the fan), index 2 = frontmost (rightmost).
const STACK_CLASSES = [
  "[grid-area:stack] transition-transform duration-300 ease-out hover:-translate-y-10",
  "[grid-area:stack] translate-x-16 translate-y-10 transition-transform duration-300 ease-out hover:-translate-y-6",
  "[grid-area:stack] translate-x-32 translate-y-20 transition-transform duration-300 ease-out hover:-translate-y-4",
];

function DisplayCard({
  className,
  layoutId,
  icon = <Sparkles className="size-4 text-[#22d3ee]" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  image,
  stack = [],
  onClick,
  isHidden = false,
}: DisplayCardProps) {
  return (
    // Outer div: CSS stack position + hover-lift + visibility.
    // Kept as a plain div so Tailwind translate classes are never overridden by framer-motion.
    <div
      className={cn("cursor-pointer", className)}
      style={{ visibility: isHidden ? "hidden" : "visible" }}
      onClick={onClick}
    >
    {/* Inner motion.div: layoutId + skewY only — no other transform values. */}
    <motion.div
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="relative flex w-[18rem] h-[380px] select-none flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] hover:border-[var(--border-glow)]"
      style={{ skewY: -8 }}
    >
      {/* Image */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: "176px", background: "var(--elevated)" }}
      >
        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt={title} className="w-full h-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(6,11,18,0.88) 100%)",
          }}
        />
        <span
          className="absolute top-3 right-3 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(34,211,238,0.08)",
            border: "1px solid rgba(34,211,238,0.22)",
            color: "#22d3ee",
          }}
        >
          {date}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-[rgba(34,211,238,0.1)] p-1 flex-shrink-0">
            {icon}
          </span>
          <h3
            className="font-display font-semibold text-sm leading-snug"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h3>
        </div>

        <p
          className="text-xs leading-relaxed flex-1 mb-3 line-clamp-4"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>

        {stack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {stack.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted)",
                }}
              >
                {s}
              </span>
            ))}
            {stack.length > 3 && (
              <span
                className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted)",
                }}
              >
                +{stack.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Cap at 3 so the fan always has 1–3 slots; offset so the frontmost slot is filled first.
  const allCards = cards ?? [];
  const capped = allCards.slice(0, 3);
  const offset = 3 - capped.length;
  const expanded = expandedIndex !== null ? capped[expandedIndex] : null;

  return (
    <>
      {/* ── Stacked fan ── */}
      <div className="grid [grid-template-areas:'stack'] place-items-center">
        {capped.map((cardProps, index) => (
          <DisplayCard
            key={index}
            {...cardProps}
            className={cn(STACK_CLASSES[offset + index], cardProps.className)}
            layoutId={`display-card-${index}`}
            isHidden={expandedIndex === index}
            onClick={() => setExpandedIndex(index)}
          />
        ))}
      </div>

      {/* ── Expanded overlay ── */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Blur backdrop */}
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-md"
              style={{ backgroundColor: "rgba(6,11,18,0.72)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpandedIndex(null)}
            />

            {/* Expanded card — shares layoutId with its source stack card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                layoutId={`display-card-${expandedIndex}`}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer pointer-events-auto"
                style={{
                  width: "400px",
                  maxWidth: "92vw",
                  background: "var(--panel)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  boxShadow:
                    "0 30px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(34,211,238,0.08)",
                  skewY: 0,
                }}
                onClick={() => setExpandedIndex(null)}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: "220px" }}>
                  {expanded.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={expanded.image}
                      alt={expanded.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 40%, rgba(6,11,18,0.92) 100%)",
                    }}
                  />
                  <span
                    className="absolute top-3 right-3 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.22)",
                      color: "#22d3ee",
                    }}
                  >
                    {expanded.date}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full bg-[rgba(34,211,238,0.1)] p-1 flex-shrink-0">
                      {expanded.icon}
                    </span>
                    <h3
                      className="font-display font-bold text-lg leading-snug"
                      style={{
                        background: "linear-gradient(135deg, #22d3ee, #34d399)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {expanded.title}
                    </h3>
                  </div>

                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--muted)" }}
                  >
                    {expanded.description}
                  </p>

                  {expanded.stack && expanded.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {expanded.stack.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--muted)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {expanded.links &&
                    (expanded.links.code ||
                      expanded.links.live ||
                      expanded.links.details ||
                      expanded.links.drive) && (
                      <div
                        className="flex flex-wrap gap-2 pt-3"
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        {expanded.links.code && (
                          <a
                            href={expanded.links.code}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost"
                            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Code ↗
                          </a>
                        )}
                        {expanded.links.live && (
                          <a
                            href={expanded.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost"
                            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Live ↗
                          </a>
                        )}
                        {expanded.links.details && (
                          <a
                            href={expanded.links.details}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost"
                            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Details ↗
                          </a>
                        )}
                        {expanded.links.drive && (
                          <a
                            href={expanded.links.drive}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost"
                            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Drive ↗
                          </a>
                        )}
                      </div>
                    )}

                  <p
                    className="text-xs mt-4 text-center"
                    style={{ color: "var(--muted)", opacity: 0.4 }}
                  >
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
