"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Section from "../components/Section";
import { type Project } from "../components/ProjectCard";
import ExperienceItem, { type Experience } from "../components/ExperienceItem";
import { IconGitHub, IconLinkedIn } from "../components/Icons";
import DisplayCards from "../components/ui/display-cards";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { SlideButton } from "../components/ui/slide-button";
import { useShaderBackground } from "../components/ui/animated-shader-hero";
import { Brain, Cpu, Box, Layers } from "lucide-react";

import profileData    from "../data/profile.json";
import projectsData   from "../data/projects.json";
import experienceData from "../data/experience.json";

export default function Page() {
  // Filters
  const filters = ["all", "AI", "Web", "Embedded", "CAD"] as const;
  type Filter = (typeof filters)[number];
  const [filter, setFilter] = useState<Filter>("all");
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState({ name: false, email: false, message: false });
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    if (!formRef.current) return false;
    const data = new FormData(formRef.current);
    const errors = {
      name:    !String(data.get("name")    ?? "").trim(),
      email:   !String(data.get("email")   ?? "").trim(),
      message: !String(data.get("message") ?? "").trim(),
    };
    setFieldErrors(errors);
    return !errors.name && !errors.email && !errors.message;
  };

  const handleSlideSubmit = async (): Promise<boolean> => {
    try {
      const res = await fetch("https://formspree.io/f/mojnyvgo", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(formRef.current!),
      });
      if (res.ok) {
        setTimeout(() => setFormState("success"), 1200);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Data
  const projects   = projectsData   as Project[];
  const experience = experienceData as Experience[];
  const profile    = profileData    as {
    languages: string[];
    frameworksLibraries: string[];
    infra: string[];
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

  // Shader background
  const shaderCanvasRef = useShaderBackground();

  // Hero parallax blobs
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

  // Display-card helpers
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
      video:       p.video,
      stack:       p.stack,
      links:       p.links,
    }));

  // Render
  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="hero-wrap">
        {/* WebGL shader background */}
        <canvas
          ref={shaderCanvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ zIndex: 0, opacity: 0.62 }}
        />

        {/* Bottom fade blends hero into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "280px",
            background: "linear-gradient(to bottom, transparent, #060b12)",
            zIndex: 3,
          }}
        />

        {/* Parallax blob overlay with teal glow on top of shader */}
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

            {/* Left text column */}
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
                Mechatronics Engineering - University of Waterloo
              </div>

              {/* Name */}
              <h1
                className="hero-el font-display font-bold mb-4"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                <span style={{ color: "#ffffff" }}>Hi, I&apos;m </span>
                <span className="text-gradient">Ali</span>
              </h1>

              {/* Tagline */}
              <p
                className="hero-el text-base md:text-lg mb-8 max-w-lg"
                style={{ color: "var(--muted)", lineHeight: 1.7 }}
              >
                I build things at the intersection of software, hardware, and AI - from
                firmware for electric race cars to AI-powered workflow tools.
              </p>

              {/* CTAs + Social icons */}
              <div className="hero-el flex flex-wrap gap-3 items-center justify-center lg:justify-start">
                <InteractiveHoverButton
                  text="Resume"
                  className="w-32 border-white/10 text-[#e2e8f0] transition-transform duration-200 ease-out hover:-translate-y-1"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/assets/Ali-Husseini-Resume.pdf";
                    a.download = "Ali-Husseini-Resume.pdf";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                />
                {profile.linkedin && (
                  <a
                    className="group relative inline-flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "1px solid rgba(255,255,255,.1)",
                      background: "#060b12",
                      color: "#e2e8f0",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className="absolute inset-0 scale-0 rounded-xl transition-all duration-300 group-hover:scale-[2]"
                      style={{ background: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)" }}
                    />
                    <span className="relative z-10"><IconLinkedIn /></span>
                  </a>
                )}
                <a
                  className="group relative inline-flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1"
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid rgba(255,255,255,.1)",
                    background: "#060b12",
                    color: "#e2e8f0",
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="absolute inset-0 scale-0 rounded-xl transition-all duration-300 group-hover:scale-[2]"
                    style={{ background: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)" }}
                  />
                  <span className="relative z-10"><IconGitHub /></span>
                </a>
              </div>
            </div>

            {/* Right headshot and stats */}
            <div className="col-span-12 lg:col-span-5 hero-right flex flex-col items-center gap-5">
              <Image
                src="/assets/ali-headshot.jpg"
                alt="Ali Husseini"
                width={280}
                height={280}
                className="avatar"
                priority
              />

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

      {/* About */}
      <Section id="overview" title="About Me">
        <div className="card p-6 md:p-8">
          <div className="grid gap-4">
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              I&apos;m a Mechatronics Engineering student at Waterloo focused on building practical software and AI
              systems. At <strong style={{ color: "#e2e8f0" }}>ATS360/Netdynamic</strong>, I worked on{" "}
              <strong style={{ color: "#e2e8f0" }}>AI-powered hiring tools</strong> for video screening,
              interview scheduling, resume parsing, and scoring workflows used by over 30 enterprise recruiting teams.
            </p>

            <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              I build mostly across software and AI:{" "}
              <strong style={{ color: "#e2e8f0" }}>React and Next.js</strong> on the frontend,{" "}
              <strong style={{ color: "#e2e8f0" }}>Node/Express and JavaScript</strong> on the backend,{" "}
              <strong style={{ color: "#e2e8f0" }}>PostgreSQL</strong> for data,{" "}
              <strong style={{ color: "#e2e8f0" }}>AWS</strong> for infrastructure, and{" "}
              <strong style={{ color: "#e2e8f0" }}>Playwright</strong> for automation. I also work close to hardware
              through embedded firmware with Waterloo Formula Electric.
            </p>

            <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              I&apos;m looking for software and AI co-ops where I can build real products, solve hard problems,
              and keep growing quickly.
            </p>

            <div className="flex flex-wrap gap-6 pt-1">
              {[
                ["location", "Ontario, Canada"],
                ["status", "open to co-ops"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div
                    className="font-mono text-xs uppercase mb-1"
                    style={{ color: "var(--muted)", letterSpacing: "0.08em" }}
                  >
                    {label}
                  </div>
                  <div
                    className="font-mono text-sm leading-snug"
                    style={{ color: label === "status" ? "#7ddff3" : "var(--text)" }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Projects">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-3">
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

        {/* Project cards */}
        {filtered.length > 0 ? (
          <div>
            <DisplayCards key={filter} cards={toProjectCards(filtered)} />
          </div>
        ) : (
          <p className="text-sm py-8" style={{ color: "var(--muted)" }}>
            No projects found for this filter.
          </p>
        )}
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience">
        <div className="timeline">
          {experience.map((xp, i) => (
            <ExperienceItem key={i} xp={xp} />
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills">
        <div className="grid grid-cols-12 gap-3">
          {[
            { title: "Languages",              items: profile.languages,              accent: "var(--teal)"  },
            { title: "Frameworks / Libraries", items: profile.frameworksLibraries,    accent: "var(--teal2)" },
            { title: "Infra",                  items: profile.infra,                   accent: "var(--teal3)" },
          ].map((g) => (
            <div key={g.title} className="col-span-12 md:col-span-4 card p-5">
              <div className="flex items-center gap-2 mb-3">
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

      {/* Education */}
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
                  BASc, Mechatronics Engineering - Waterloo, Ontario, Canada
                </div>
              </div>
            </div>
            <span className="badge self-start sm:self-auto whitespace-nowrap" style={{ fontSize: "0.75rem", padding: "4px 12px" }}>
              Sept 2025 - Apr 2030
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

      {/* Contact */}
      <Section id="contact" title="Get in Touch">
        <p
          className="mb-8 text-sm"
          style={{ color: "var(--muted)", maxWidth: "480px" }}
        >
          Have a project, opportunity, or just want to say hi? Drop me a line and I'll
          get back to you.
        </p>

        {formState === "success" ? (
          <div
            className="max-w-xl card p-6 md:p-8 flex flex-col items-center justify-center gap-3 text-center"
            style={{ minHeight: "200px" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
              style={{ background: "rgba(34,211,238,.1)", border: "1px solid rgba(34,211,238,.25)" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11.5l5 5 9-9" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>Message sent!</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Thanks for reaching out - I'll get back to you soon.</p>
            <button
              className="mt-2 text-xs underline underline-offset-4"
              style={{ color: "var(--muted)" }}
              onClick={() => setFormState("idle")}
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            className="max-w-xl card p-6 md:p-8 grid gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Your name"
                className={`form-input${fieldErrors.name ? " form-input-error" : ""}`}
                onChange={() => setFieldErrors((e) => ({ ...e, name: false }))}
              />
              <input
                name="email"
                type="email"
                placeholder="Your email"
                className={`form-input${fieldErrors.email ? " form-input-error" : ""}`}
                onChange={() => setFieldErrors((e) => ({ ...e, email: false }))}
              />
            </div>
            <textarea
              name="message"
              placeholder="Your message"
              rows={5}
              className={`form-input${fieldErrors.message ? " form-input-error" : ""}`}
              style={{ resize: "vertical" }}
              onChange={() => setFieldErrors((e) => ({ ...e, message: false }))}
            />
            <div className="flex justify-end pl-2">
              <SlideButton validate={validateForm} onSlideComplete={handleSlideSubmit} label="Slide to send" />
            </div>
          </form>
        )}
      </Section>
    </main>
  );
}
