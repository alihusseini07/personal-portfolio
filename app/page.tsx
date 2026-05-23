"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Section from "../components/Section";
import { type Project } from "../components/ProjectCard";
import ExperienceItem, { type Experience } from "../components/ExperienceItem";
import { IconGitHub, IconLinkedIn, IconEmail } from "../components/Icons";
import DisplayCards from "../components/ui/display-cards";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { useShaderBackground } from "../components/ui/animated-shader-hero";
import { Brain, Cpu, Box, Layers, FileText } from "lucide-react";

import profileData    from "../data/profile.json";
import projectsData   from "../data/projects.json";
import experienceData from "../data/experience.json";

export default function Page() {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 280;
    canvas.height = 280;

    let animId: number;
    let frame = 0;

    function drawStatic() {
      frame++;
      // draw full noise every frame
      const imageData = ctx!.createImageData(canvas!.width, canvas!.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
      }
      ctx!.putImageData(imageData, 0, 0);

      // occasional horizontal band of heavier static every ~90 frames
      if (frame % 90 < 4) {
        const bandY = Math.random() * canvas!.height;
        const bandH = 8 + Math.random() * 20;
        const band = ctx!.createImageData(canvas!.width, Math.ceil(bandH));
        for (let i = 0; i < band.data.length; i += 4) {
          const v = Math.random() * 255;
          band.data[i] = v; band.data[i + 1] = v; band.data[i + 2] = v; band.data[i + 3] = 255;
        }
        ctx!.putImageData(band, 0, bandY);
      }

      animId = requestAnimationFrame(drawStatic);
    }

    drawStatic();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Data
  const projects   = projectsData   as Project[];
  const experience = experienceData as Experience[];
  const profile    = profileData    as {
    languages: string[];
    frameworksLibraries: string[];
    infra: string[];
    cad: string[];
    personalEmail: string;
    github: string;
    linkedin?: string;
  };

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
    if (c.includes("ai") || c.includes("ml"))        return <Brain  className="size-4 text-[#68BA7F]" />;
    if (c.includes("embedded") || c.includes("iot")) return <Cpu    className="size-4 text-[#2E6F40]" />;
    if (c.includes("cad") || c.includes("3d"))       return <Box    className="size-4 text-[#2E6F40]" />;
    return <Layers className="size-4 text-[#68BA7F]" />;
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

  const skillIcons: Record<string, string> = {
    Python: "https://cdn.simpleicons.org/python",
    TypeScript: "https://cdn.simpleicons.org/typescript",
    JavaScript: "https://cdn.simpleicons.org/javascript",
    "C++": "https://cdn.simpleicons.org/cplusplus",
    AutoCAD: "/icons/autocad.svg",
    Inventor: "/icons/autodesk-inventor.svg",
    "Fusion 360": "/icons/fusion-360.svg",
    SolidWorks: "/icons/solidworks.svg",
    Java: "/icons/java.svg",
    SQL: "/icons/sql.svg",
    Swift: "https://cdn.simpleicons.org/swift",
    Bash: "https://cdn.simpleicons.org/gnubash",
    HTML: "https://cdn.simpleicons.org/html5",
    CSS: "https://cdn.simpleicons.org/css",
    React: "https://cdn.simpleicons.org/react",
    "Next.js": "https://cdn.simpleicons.org/nextdotjs/white",
    SwiftUI: "/icons/swiftui.svg",
    "Tailwind CSS": "https://cdn.simpleicons.org/tailwindcss",
    "Node.js": "https://cdn.simpleicons.org/nodedotjs",
    Express: "https://cdn.simpleicons.org/express/white",
    Fastify: "https://cdn.simpleicons.org/fastify/white",
    Prisma: "https://cdn.simpleicons.org/prisma/white",
    NumPy: "https://cdn.simpleicons.org/numpy",
    Pandas: "https://cdn.simpleicons.org/pandas",
    Playwright: "/icons/playwright.svg",
    pytest: "https://cdn.simpleicons.org/pytest",
    Git: "https://cdn.simpleicons.org/git",
    GitHub: "https://cdn.simpleicons.org/github/white",
    Docker: "https://cdn.simpleicons.org/docker",
    PostgreSQL: "/icons/postgresql.svg",
    Supabase: "https://cdn.simpleicons.org/supabase",
    Neon: "https://cdn.simpleicons.org/neon",
    Railway: "https://cdn.simpleicons.org/railway/white",
    AWS: "/icons/aws.svg",
    S3: "/icons/aws-s3.svg",
    Lambda: "/icons/aws-lambda.svg",
    Bedrock: "/icons/aws-bedrock.svg",
    NetSuite: "/icons/netsuite.svg",
    SuiteCloud: "/icons/suitecloud.svg",
    SuiteScript: "/icons/suitescript.svg",
    Notion: "https://cdn.simpleicons.org/notion/white",
    Excel: "/icons/excel.svg",
    FastAPI: "https://cdn.simpleicons.org/fastapi",
    Celery: "https://cdn.simpleicons.org/celery",
    Redis: "https://cdn.simpleicons.org/redis",
    Vite: "https://cdn.simpleicons.org/vite",
    Kubernetes: "https://cdn.simpleicons.org/kubernetes",
  };

  const skillGroups = [
    { title: "// LANGUAGES",              prefix: "LANG",   items: profile.languages,           accent: "var(--cyan)"    },
    { title: "// FRAMEWORKS",             prefix: "FW",     items: profile.frameworksLibraries,  accent: "var(--green)"   },
    { title: "// INFRA",                  prefix: "INFRA",  items: profile.infra,                accent: "var(--magenta)" },
    { title: "// CAD & DESIGN",           prefix: "CAD",    items: profile.cad,                  accent: "#a8dbb8"        },
  ];

  return (
    <main>
      {/* ── Hero ─────────────────────────────────── */}
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
            height: "420px",
            background: "linear-gradient(to bottom, transparent 0%, #020202 85%)",
            zIndex: 3,
          }}
        />

        {/* Parallax blob overlay */}
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

              {/* Terminal status prompt */}
              <div
                className="hero-el mb-5 flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  color: "var(--muted)",
                }}
              >
                <span style={{ color: "var(--cyan)", textShadow: "0 0 8px rgba(104,186,127,.7)" }}>$</span>
                <span>STATUS=</span>
                <span style={{ color: "var(--cyan)" }}>SEEKING_COOP</span>
                <span
                  className="cursor-blink"
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "14px",
                    background: "var(--cyan)",
                    boxShadow: "0 0 6px rgba(104,186,127,.8)",
                    verticalAlign: "middle",
                  }}
                />
              </div>

              {/* Name with glitch effect */}
              <h1
                className="hero-el mb-4"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  fontFamily: "var(--font-display, monospace)",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#c8e0e8" }}>Hi, I&apos;m{" "}</span>
                <span
                  className="glitch-text"
                  data-text="ALI"
                  style={{
                    color: "var(--cyan)",
                    textShadow: "0 0 20px rgba(104,186,127,.5), 0 0 40px rgba(104,186,127,.2)",
                  }}
                >
                  ALI
                </span>
              </h1>


              {/* CTAs + Social icons */}
              <div className="hero-el flex flex-wrap gap-3 items-center justify-center lg:justify-start">
                <InteractiveHoverButton
                  text="Resume"
                  className="w-32 border-white/10 text-[#e2e8f0] transition-transform duration-200 ease-out hover:-translate-y-1"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/assets/Ali_Husseini_Resume.pdf";
                    a.download = "Ali_Husseini_Resume.pdf";
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
                      style={{ background: "linear-gradient(135deg, #68BA7F 0%, #4a9960 100%)" }}
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
                    style={{ background: "linear-gradient(135deg, #68BA7F 0%, #4a9960 100%)" }}
                  />
                  <span className="relative z-10"><IconGitHub /></span>
                </a>
              </div>

              {/* System info line */}
              <div
                className="hero-el mt-6 flex items-center gap-4"
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  fontSize: "0.68rem",
                  color: "var(--muted)",
                  letterSpacing: "0.06em",
                  opacity: 0.7,
                }}
              >
                <span>
                  <span style={{ color: "rgba(104,186,127,.4)" }}>SYS:</span> Ontario, Canada
                </span>
                <span style={{ color: "rgba(104,186,127,.2)" }}>|</span>
                <span>
                  <span style={{ color: "rgba(104,186,127,.4)" }}>UNIV:</span> Tron @ uWaterloo
                </span>
              </div>
            </div>

            {/* Right — avatar */}
            <div className="col-span-12 lg:col-span-5 hero-right flex flex-col items-center gap-5">
              <div className="avatar-tv-wrapper">
                <Image
                  src="/assets/ali-headshot.jpg"
                  alt="Ali Husseini"
                  width={280}
                  height={280}
                  className="avatar"
                  priority
                />
                <canvas ref={staticCanvasRef} className="tv-static-overlay" />
                <div className="tv-scanlines" />
                <div className="tv-vignette" />
                <div className="tv-glitch-h" />
              </div>

            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
              fontFamily: "var(--font-body, monospace)",
              color: "var(--muted)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
            }}
          >
            <span className="uppercase tracking-widest text-xs opacity-60">scroll</span>
            <span
              className="w-px h-10 block"
              style={{
                background: "linear-gradient(to bottom, rgba(104,186,127,.4), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────── */}
      <Section id="overview" title="About Me">
        <div className="terminal-window">
          {/* Chrome bar */}
          <div className="terminal-chrome">
            
            
            
            <span className="terminal-title">[SYSTEM] — about.log</span>
          </div>
          {/* Body */}
          <div className="terminal-body">
            <div className="grid gap-4">
              <p
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  fontSize: "0.88rem",
                  color: "var(--text)",
                  lineHeight: 1.85,
                }}
              >
                <span style={{ color: "var(--cyan)" }}>&gt;</span>{" "}
                Mechatronics Engineering student at Waterloo focused on practical software and AI.
                At{" "}
                <strong style={{ color: "#e2e8f0" }}>ATS360 / Netdynamic</strong>, shipped{" "}
                <strong style={{ color: "#e2e8f0" }}>AI-powered hiring tools</strong>{" "}
                for video screening, interview scheduling, resume parsing, and scoring, used by 30+ enterprise recruiting teams.
              </p>

              <p
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  fontSize: "0.88rem",
                  color: "var(--muted)",
                  lineHeight: 1.85,
                }}
              >
                <span style={{ color: "rgba(104,186,127,.4)" }}>&gt;</span>{" "}
                Stack:{" "}
                <strong style={{ color: "#e2e8f0" }}>React / Next.js</strong> on the frontend,{" "}
                <strong style={{ color: "#e2e8f0" }}>Node / Express</strong> on the backend,{" "}
                <strong style={{ color: "#e2e8f0" }}>PostgreSQL</strong> for data,{" "}
                <strong style={{ color: "#e2e8f0" }}>AWS</strong> for infra,{" "}
                <strong style={{ color: "#e2e8f0" }}>Playwright</strong> for automation.
                Also close to hardware through embedded firmware with Waterloo Formula Electric.
              </p>

              <p
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  fontSize: "0.88rem",
                  color: "var(--muted)",
                  lineHeight: 1.85,
                }}
              >
                <span style={{ color: "rgba(104,186,127,.4)" }}>&gt;</span>{" "}
                Looking for software and AI co-ops where I can build real products, solve hard problems, and keep growing fast.
              </p>

              <div className="flex flex-wrap gap-6 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  ["$ echo $LOCATION", "Ontario, Canada"],
                  ["$ echo $STATUS",   "OPEN_TO_COOPS"],
                ].map(([cmd, value]) => (
                  <div key={cmd} style={{ fontFamily: "var(--font-body, monospace)" }}>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--muted)",
                        letterSpacing: "0.06em",
                        marginBottom: "4px",
                      }}
                    >
                      {cmd}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: cmd.includes("STATUS") ? "var(--cyan)" : "var(--text)",
                        textShadow: cmd.includes("STATUS") ? "0 0 8px rgba(104,186,127,.4)" : "none",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Projects ─────────────────────────────── */}
      <Section id="projects" title="Projects">
        <div>
          <DisplayCards cards={toProjectCards(projects)} />
        </div>
      </Section>

      {/* ── Experience ───────────────────────────── */}
      <Section id="experience" title="Experience">
        <div className="timeline">
          {experience.map((xp, i) => (
            <ExperienceItem key={i} xp={xp} />
          ))}
        </div>
      </Section>

      {/* ── Skills ───────────────────────────────── */}
      <Section id="skills" title="Skills">
        <div className="grid gap-3">
          {skillGroups.map((g) => (
            <div
              key={g.title}
              className="card p-4 md:p-5"
              style={{ borderLeft: `2px solid ${g.accent}` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-48 flex-shrink-0">
                  <h3
                    style={{
                      fontFamily: "var(--font-body, monospace)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      color: g.accent,
                      textShadow: `0 0 8px ${g.accent}66`,
                      marginBottom: "4px",
                    }}
                  >
                    {g.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body, monospace)",
                      fontSize: "0.65rem",
                      color: "var(--muted)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    [{g.items.length} modules loaded]
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 flex-1">
                  {g.items.map((it) => (
                    <div
                      key={it}
                      className="skill-tile flex items-center gap-2 min-w-[130px] px-3 py-2"
                      style={{
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        background: "rgba(104,186,127,.02)",
                      }}
                    >
                      <span
                        className="w-7 h-7 flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{
                          borderRadius: "3px",
                          border: "1px solid rgba(255,255,255,.06)",
                          background: "rgba(255,255,255,.04)",
                        }}
                      >
                        <img
                          src={skillIcons[it]}
                          alt={`${it} icon`}
                          className="w-5 h-5 object-contain"
                        />
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body, monospace)",
                          fontSize: "0.78rem",
                          color: "var(--text)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {it}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Education ────────────────────────────── */}
      <Section id="education" title="Education">
        <div className="terminal-window">
          <div className="terminal-chrome">
            
            
            
            <span className="terminal-title">[ACADEMIC] — credentials.log</span>
          </div>
          <div className="terminal-body">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    borderRadius: "4px",
                    border: "1px solid rgba(104,186,127,.15)",
                    background: "rgba(104,186,127,.04)",
                  }}
                >
                  <Image
                    src="/assets/uwaterloo.png"
                    alt="University of Waterloo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display, monospace)",
                      fontSize: "1rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--cyan)",
                      textShadow: "0 0 12px rgba(104,186,127,.4)",
                    }}
                  >
                    University of Waterloo
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body, monospace)",
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                      marginTop: "2px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    BASc, Mechatronics Engineering · Waterloo, Ontario
                  </div>
                </div>
              </div>
              <span className="badge self-start sm:self-auto whitespace-nowrap" style={{ fontSize: "0.68rem" }}>
                Sept 2025 – Apr 2030
              </span>
            </div>

          </div>
        </div>
      </Section>

      {/* ── Contact ──────────────────────────────── */}
      <Section id="contact" title="Contact">
        <div className="terminal-window w-full">
          {/* Chrome bar */}
          <div className="terminal-chrome">
            <span className="terminal-title">[ENDPOINTS] — contact.cfg</span>
          </div>

          {/* Rows */}
          <div>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-row">
                <span className="contact-row-idx">01</span>
                <span className="contact-row-icon"><IconLinkedIn /></span>
                <span className="contact-row-label">LinkedIn</span>
                <span className="contact-row-addr">/in/ahusseini-profile</span>
                <span className="badge contact-row-badge" style={{ fontSize: "0.62rem" }}>→ connect</span>
              </a>
            )}
            <a href={github} target="_blank" rel="noreferrer" className="contact-row">
              <span className="contact-row-idx">02</span>
              <span className="contact-row-icon"><IconGitHub /></span>
              <span className="contact-row-label">GitHub</span>
              <span className="contact-row-addr">github.com/alihusseini07</span>
              <span className="badge contact-row-badge" style={{ fontSize: "0.62rem" }}>→ view repos</span>
            </a>
            <a href={`mailto:${email}`} className="contact-row">
              <span className="contact-row-idx">03</span>
              <span className="contact-row-icon"><IconEmail /></span>
              <span className="contact-row-label">Email</span>
              <span className="contact-row-addr">{email}</span>
              <span className="badge contact-row-badge" style={{ fontSize: "0.62rem" }}>→ send message</span>
            </a>
            <a href="/assets/Ali_Husseini_Resume.pdf" download className="contact-row" style={{ borderBottom: "none" }}>
              <span className="contact-row-idx">04</span>
              <span className="contact-row-icon"><FileText size={15} /></span>
              <span className="contact-row-label">Resume</span>
              <span className="contact-row-addr">Ali_Husseini_Resume.pdf</span>
              <span className="badge contact-row-badge" style={{ fontSize: "0.62rem" }}>↓ download</span>
            </a>
          </div>

          {/* Cursor footer */}
          <div
            style={{
              padding: "14px 24px",
              borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-body, monospace)",
              fontSize: "0.78rem",
              color: "rgba(104,186,127,.35)",
            }}
          >
            <span style={{ color: "rgba(104,186,127,.5)" }}>$</span>{" "}
            <span className="cursor-blink" style={{ color: "var(--cyan)" }}>▋</span>
          </div>
        </div>
      </Section>
    </main>
  );
}
