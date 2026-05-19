import Image from "next/image";
import { motion } from "framer-motion";

export interface Experience {
  role: string;
  org: string;
  location: string;
  dates: string;
  image?: string;
  bullets: string[];
}

export default function ExperienceItem({ xp }: { xp: Experience }) {
  return (
    <motion.div
      className="timeline-item"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <span className="timeline-marker">▶</span>

      <div
        className="card card-bracket p-5"
        style={{ borderLeft: "2px solid rgba(104,186,127,.5)" }}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          {xp.image && (
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center overflow-hidden"
              style={{
                borderRadius: "4px",
                border: "1px solid rgba(104,186,127,.15)",
                background: "rgba(104,186,127,.04)",
              }}
            >
              <Image
                src={xp.image}
                alt={`${xp.org} logo`}
                width={64}
                height={64}
                className="w-full h-full object-contain p-2"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
              <div className="min-w-0">
                <h3
                  style={{
                    fontFamily: "var(--font-display, monospace)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--cyan)",
                    textShadow: "0 0 8px rgba(104,186,127,.4)",
                  }}
                >
                  {xp.role}
                </h3>
                <p
                  className="text-sm mt-0.5"
                  style={{
                    fontFamily: "var(--font-body, monospace)",
                    color: "var(--muted)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {xp.org} · {xp.location}
                </p>
              </div>
              <span
                className="badge self-start flex-shrink-0 whitespace-nowrap"
                style={{ fontSize: "0.68rem" }}
              >
                {xp.dates}
              </span>
            </div>

            <ul className="grid gap-2">
              {xp.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body, monospace)",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    className="mt-[5px] flex-shrink-0 text-xs"
                    style={{ color: "rgba(104,186,127,.5)" }}
                  >
                    &gt;
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
