import { motion } from "framer-motion";

export interface Experience {
  role: string;
  org: string;
  location: string;
  dates: string;
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
      <span className="timeline-dot" />

      <div className="card p-5">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3
              className="font-display font-bold text-base text-gradient leading-tight"
            >
              {xp.role}
            </h3>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--muted)" }}
            >
              {xp.org} · {xp.location}
            </p>
          </div>
          <span
            className="badge self-start flex-shrink-0 whitespace-nowrap"
            style={{ fontSize: "0.72rem" }}
          >
            {xp.dates}
          </span>
        </div>

        {/* Bullet points */}
        <ul className="grid gap-2">
          {xp.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              <span
                className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--teal), var(--teal2))",
                }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
