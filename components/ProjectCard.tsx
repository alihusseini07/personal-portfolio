import Image from "next/image";
import { motion } from "framer-motion";

export interface Project {
  title: string;
  category: string;
  tags: string[];
  description: string;
  stack: string[];
  image?: string;
  links?: { code?: string; live?: string; details?: string; drive?: string };
}

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.article
      className="card overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image area */}
      <div className="aspect-video relative overflow-hidden" style={{ background: "var(--panel)" }}>
        {p.image && (
          <Image
            src={p.image}
            alt={p.title}
            fill
            className="object-cover"
            style={{ transition: "transform 400ms ease" }}
          />
        )}
        {/* Bottom-to-top gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(12,21,32,0.88) 100%)",
          }}
        />
        {/* Category badge — top right */}
        <span
          className="absolute top-3 right-3 badge"
          style={{ fontSize: "0.7rem" }}
        >
          {p.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-display font-semibold text-base mb-1.5 leading-snug"
          style={{ color: "var(--text)" }}
        >
          {p.title}
        </h3>

        <p
          className="text-sm mb-4 flex-1 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {p.description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.stack.map((s, i) => (
            <span key={i} className="badge" style={{ fontSize: "0.7rem" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Action links */}
        {(p.links?.code || p.links?.live || p.links?.details || p.links?.drive) && (
          <div className="flex gap-2 flex-wrap pt-1 border-t" style={{ borderColor: "var(--border)" }}>
            {p.links?.code && (
              <a
                className="btn btn-ghost mt-3"
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                href={p.links.code}
                target="_blank"
                rel="noreferrer"
              >
                Code ↗
              </a>
            )}
            {p.links?.live && (
              <a
                className="btn btn-ghost mt-3"
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                href={p.links.live}
                target="_blank"
                rel="noreferrer"
              >
                Live ↗
              </a>
            )}
            {p.links?.details && (
              <a
                className="btn btn-ghost mt-3"
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                href={p.links.details}
                target="_blank"
                rel="noreferrer"
              >
                Details ↗
              </a>
            )}
            {p.links?.drive && (
              <a
                className="btn btn-ghost mt-3"
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                href={p.links.drive}
                target="_blank"
                rel="noreferrer"
              >
                Drive ↗
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
