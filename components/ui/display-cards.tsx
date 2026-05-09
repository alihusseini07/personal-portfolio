"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
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
    return (
      <video
        src={video}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop={expanded}
        autoPlay={expanded}
        preload={expanded ? "auto" : "metadata"}
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
      <Sparkles className="size-8 text-[#22d3ee]" />
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

function DisplayCard({
  layoutId,
  icon = <Sparkles className="size-4 text-[#22d3ee]" />,
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
        <span
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold"
          style={{
            background: "rgba(34,211,238,0.08)",
            border: "1px solid rgba(34,211,238,0.22)",
            color: "#22d3ee",
          }}
        >
          {date}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex-shrink-0 rounded-full bg-[rgba(34,211,238,0.1)] p-1">
            {icon}
          </span>
          <h3
            className="font-display text-sm font-semibold leading-snug"
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
          className="mb-3 line-clamp-4 flex-1 text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>

        {stack.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {stack.slice(0, 4).map((s, i) => (
              <span
                key={i}
                className="rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted)",
                }}
              >
                {s}
              </span>
            ))}
            {stack.length > 4 && (
              <span
                className="rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted)",
                }}
              >
                +{stack.length - 4}
              </span>
            )}
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const allCards = cards ?? [];
  const expanded = expandedIndex !== null ? allCards[expandedIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {allCards.map((cardProps, index) => (
          <DisplayCard
            key={`${cardProps.title}-${index}`}
            {...cardProps}
            layoutId={`display-card-${index}`}
            onClick={() => setExpandedIndex(index)}
          />
        ))}
      </div>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-md"
              style={{ backgroundColor: "rgba(6,11,18,0.72)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpandedIndex(null)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`display-card-${expandedIndex}`}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="relative max-h-[92vh] w-[760px] max-w-[94vw] cursor-pointer overflow-y-auto rounded-2xl pointer-events-auto"
                style={{
                  background: "var(--panel)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  boxShadow:
                    "0 30px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(34,211,238,0.08)",
                }}
                onClick={() => setExpandedIndex(null)}
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
                      background:
                        "linear-gradient(to bottom, transparent 45%, rgba(6,11,18,0.92) 100%)",
                    }}
                  />
                  <span
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold"
                    style={{
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.22)",
                      color: "#22d3ee",
                    }}
                  >
                    {expanded.date}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex-shrink-0 rounded-full bg-[rgba(34,211,238,0.1)] p-1">
                      {expanded.icon}
                    </span>
                    <h3
                      className="font-display text-lg font-bold leading-snug sm:text-xl"
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
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {expanded.description}
                  </p>

                  {expanded.stack && expanded.stack.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {expanded.stack.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
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

                  <ProjectLinks links={expanded.links} />

                  <p
                    className="mt-4 text-center text-xs"
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
