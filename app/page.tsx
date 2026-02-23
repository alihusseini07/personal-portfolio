"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Section from "../components/Section";
import { type Project } from "../components/ProjectCard";
import ExperienceItem, { type Experience } from "../components/ExperienceItem";
import { IconEmail, IconGitHub, IconLinkedIn } from "../components/Icons";
import DisplayCards from "../components/ui/display-cards";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { useShaderBackground } from "../components/ui/animated-shader-hero";
import { Brain, Cpu, Box, Layers } from "lucide-react";

import profileData    from "../data/profile.json";
import projectsData   from "../data/projects.json";
import experienceData from "../data/experience.json";

export default function Page() {
  // ── Filters ──────────────────────────────────────────
  const filters = ["all", "AI", "Web", "Embedded", "CAD"] as const;
  type Filter = (typeof filters)[number];
  const [filter, setFilter] = useState<Filter>("all");

  // ── Data ─────────────────────────────────────────────
  const projects   = projectsData   as Project[];
  const experience = experienceData as Experience[];
  const profile    = profileData    as {
    skills: string[];
    tools: string[];
    certifications: string[];
    personalEmail: string;
    github: string;
    linkedin?: string;
  };

  const matchesFilter = (p: Project, f: Filter) => {
    if (f === "all") return true;
    const cat  = (p.category || "").toLowerCase();
    const tags = (p.tags || []).map((t) => String(t).toLowerCase());
    if (f === "AI")       return cat.includes("ai")       || tags.includes("ai");
    if (f === "Web")      return cat.includes("web")      || tags.includes("web");
    if (f === "Embedded") return cat.includes("embedded") || tags.includes("embedded");
    if (f === "CAD")      return cat.includes("cad")      || tags.includes("cad");
    return false;
  };

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilter(p, filter)),
    [projects, filter]
  );

  // ── Shader background ─────────────────────────────────
  const shaderCanvasRef = useShaderBackground();

  // ── Hero parallax blobs ───────────────────────────────
  const heroRef = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLSpanElement>(null);
  const l2 = useRef<HTMLSpanElement>(null);
  const l3 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const move = (xr: number, yr: number) => {
      if (l1.current) l1.current.style.transform = `translate(${xr * 14}px, ${yr * 10}px)`;
      if (l2.current) l2.current.style.transform = `translate(${xr * -10}px, ${yr * -7}px)`;
      if (l3.current) l3.current.style.transform = `translate(${xr * 6}px, ${yr * 4}px)`;
    };

    const onMouse = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const xr = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
      const yr = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
      move(xr, yr);
    };

    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  const email  = profile.personalEmail || "ahusseini007@gmail.com";
  const github = profile.github        || "https://github.com/alihusseini07";

  // ── Display-card helpers ──────────────────────────────
  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes("ai") || c.includes("ml"))        return <Brain  className="size-4 text-[#22d3ee]" />;
    if (c.includes("embedded") || c.includes("iot")) return <Cpu    className="size-4 text-[#34d399]" />;
    if (c.includes("cad") || c.includes("3d"))       return <Box    className="size-4 text-[#14b8a6]" />;
    return <Layers className="size-4 text-[#22d3ee]" />;
  };

  const toProjectCards = (list: Project[]) =>
    list.map((p) => ({
      icon:        getCategoryIcon(p.category),
      title:       p.title,
      description: p.description,
      date:        p.category,
      image:       p.image,
      stack:       p.stack,
      links:       p.links,
    }));

  // ── Render ────────────────────────────────────────────
  return (
    <main>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━ */}
      <section ref={heroRef} className="hero-wrap">
        {/* WebGL shader background */}
        <canvas
          ref={shaderCanvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ zIndex: 0, opacity: 0.62 }}
        />

        {/* Bottom fade — blends hero into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "280px",
            background: "linear-gradient(to bottom, transparent, #060b12)",
            zIndex: 3,
          }}
        />

        {/* Parallax blob overlay — teal glow on top of shader */}
        <div className="hero-bg" style={{ zIndex: 1 }}>
          <span ref={l1} className="hero-l1" />
          <span ref={l2} className="hero-l2" />
          <span ref={l3} className="hero-l3" />
        </div>

        {/* Main content */}
        <div
          className="container relative z-10 flex flex-col justify-center"
          style={{ minHeight: "calc(92vh - 64px)", paddingTop: "80px", paddingBottom: "80px" }}
        >
          <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">

            {/* Left — text column */}
            <div className="col-span-12 lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">

              {/* Intro badge */}
              <div
                className="hero-el inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(34,211,238,.08)",
                  border: "1px solid rgba(34,211,238,.22)",
                  color: "#22d3ee",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: "#22d3ee",
                    animation: "scroll-bounce 2s ease-in-out infinite",
                  }}
                />
                Mechatronics Engineering · University of Waterloo
              </div>

              {/* Name */}
              <h1
                className="hero-el font-display font-bold text-gradient mb-4"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                Ali Husseini
              </h1>

              {/* Tagline */}
              <p
                className="hero-el text-base md:text-lg mb-8 max-w-lg"
                style={{ color: "var(--muted)", lineHeight: 1.7 }}
              >
                I build things at the intersection of software, hardware, and AI — from
                firmware for electric race cars to AI-powered workflow tools.
              </p>

              {/* Primary CTAs */}
              <div className="hero-el flex flex-wrap gap-3 justify-center lg:justify-start mb-5">
                <InteractiveHoverButton
                  text="Resume"
                  className="w-32 border-white/10 text-[#e2e8f0]"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/assets/Ali-Husseini-Resume.pdf";
                    a.download = "Ali-Husseini-Resume.pdf";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                />
              </div>

              {/* Social icons */}
              <div className="hero-el flex gap-3 justify-center lg:justify-start">
                <a className="btn-icon" href={`mailto:${email}`} aria-label="Email">
                  <IconEmail />
                </a>
                {profile.linkedin && (
                  <a
                    className="btn-icon"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <IconLinkedIn />
                  </a>
                )}
                <a
                  className="btn-icon"
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <IconGitHub />
                </a>
              </div>
            </div>

            {/* Right — headshot + stats */}
            <div className="col-span-12 lg:col-span-5 hero-right flex flex-col items-center gap-5">
              <Image
                src="/assets/ali-headshot.jpg"
                alt="Ali Husseini"
                width={280}
                height={280}
                className="avatar"
                priority
              />

              {/* Quick stats */}
              <div className="flex gap-3 flex-wrap justify-center">
                {[
                  { value: "3+",  label: "Projects"   },
                  { value: "1st", label: "Year"       },
                  { value: "UW",  label: "Waterloo"   },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center px-5 py-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.08)",
                      minWidth: "72px",
                    }}
                  >
                    <div
                      className="text-gradient font-display font-bold"
                      style={{ fontSize: "1.35rem", letterSpacing: "-0.03em" }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--muted)" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
          >
            <span className="uppercase tracking-widest text-xs opacity-60">scroll</span>
            <span
              className="w-px h-10 block"
              style={{
                background: "linear-gradient(to bottom, rgba(122,154,179,.5), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ABOUT ━━━ */}
      <Section id="overview" title="About Me">
        <div className="card p-6 md:p-8">
          <div className="grid gap-4">
            {[
              "👋 Hey! I'm Ali, a Mechatronics Engineering student at the University of Waterloo who enjoys turning rough ideas into practical, well-thought-out systems that actually work in the real world.",
              "🧩 I've worked across software, hardware, and AI-driven projects, from building tools like Joblyze to designing and iterating on robotics systems. I like breaking down messy problems, structuring them clearly, and shipping something usable instead of overengineering from the start.",
              "⚙️ Interests: applied AI, workflow tools, structured problem solving, clean system design, and improving ideas through iteration rather than settling for the first solution.",
              "🤝 Outside of coursework, I enjoy staying active with kickboxing and the gym. I've tutored math and science, which has shaped how I communicate technical ideas to non-technical audiences. I care a lot about clarity, empathy, and making sure people actually understand what's being built and why.",
              "🚀 I'm especially drawn to startup environments and fast-moving teams where learning by doing, ownership, and collaboration matter more than titles or experience level.",
            ].map((text, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: i === 0 ? "var(--text)" : "var(--muted)", fontSize: i === 0 ? "1rem" : "0.9rem" }}>
                {text}
              </p>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              {["Applied AI", "Embedded Systems", "System Design", "Workflow Tools", "Ontario, Canada"].map(
                (t) => (
                  <span key={t} className="badge">
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ PROJECTS ━━━ */}
      <Section id="projects" title="Projects">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`chip ${filter === t ? "chip-active" : ""}`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        {/* Stacked display cards */}
        {filtered.length > 0 ? (
          <div className="flex justify-center py-10 pb-28 pr-36">
            <DisplayCards key={filter} cards={toProjectCards(filtered)} />
          </div>
        ) : (
          <p className="text-sm py-8" style={{ color: "var(--muted)" }}>
            No projects found for this filter.
          </p>
        )}
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ EXPERIENCE ━━━ */}
      <Section id="experience" title="Experience">
        <div className="timeline">
          {experience.map((xp, i) => (
            <ExperienceItem key={i} xp={xp} />
          ))}
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SKILLS ━━━ */}
      <Section id="skills" title="Skills, Tools & Certifications">
        <div className="grid grid-cols-12 gap-4">
          {[
            { title: "Skills",           items: profile.skills,           accent: "var(--teal)"  },
            { title: "Tools",            items: profile.tools,            accent: "var(--teal2)" },
            { title: "Certifications",   items: profile.certifications,   accent: "var(--teal3)" },
          ].map((g) => (
            <div key={g.title} className="col-span-12 md:col-span-4 card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-1 h-5 rounded-full flex-shrink-0"
                  style={{ background: g.accent }}
                />
                <h3
                  className="font-display font-semibold text-sm text-gradient"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {g.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it, ii) => (
                  <span key={ii} className="badge">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ EDUCATION ━━━ */}
      <Section id="education" title="Education">
        <div className="card p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{
                  border: "1px solid rgba(255,255,255,.1)",
                  background: "rgba(255,255,255,.06)",
                }}
              >
                <Image
                  src="/assets/uwaterloo.png"
                  alt="University of Waterloo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div
                  className="font-display font-bold text-xl text-gradient"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  University of Waterloo
                </div>
                <div
                  className="text-sm mt-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  BASc, Mechatronics Engineering · Waterloo, Ontario, Canada
                </div>
              </div>
            </div>
            <span className="badge self-start sm:self-auto whitespace-nowrap" style={{ fontSize: "0.75rem", padding: "4px 12px" }}>
              Sept 2025 – Apr 2030
            </span>
          </div>

          <p
            className="mt-5 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Relevant coursework: Programming (C++, OOP), Applied Math (Python, Linear Algebra),
            Engineering Design (AutoCAD, SolidWorks).
          </p>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ CONTACT ━━━ */}
      <Section id="contact" title="Get in Touch">
        <p
          className="mb-8 text-sm"
          style={{ color: "var(--muted)", maxWidth: "480px" }}
        >
          Have a project, opportunity, or just want to say hi? Drop me a line and I'll
          get back to you.
        </p>

        <form
          className="max-w-xl card p-6 md:p-8 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const data    = new FormData(e.currentTarget);
            const name    = String(data.get("name")    ?? "");
            const mail    = String(data.get("email")   ?? email);
            const message = String(data.get("message") ?? "");
            const body    = encodeURIComponent(
              `Name: ${name}\nEmail: ${mail}\n\n${message}`
            );
            window.location.href = `mailto:${email}?subject=Portfolio%20Inquiry&body=${body}`;
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Your name"
              required
              className="form-input"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              className="form-input"
            />
          </div>
          <textarea
            name="message"
            placeholder="Your message"
            rows={5}
            required
            className="form-input"
            style={{ resize: "vertical" }}
          />
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </div>
        </form>
      </Section>
    </main>
  );
}
