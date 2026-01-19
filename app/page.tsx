"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Section from "../components/Section";
import ProjectCard, { type Project } from "../components/ProjectCard";
import ExperienceItem, { type Experience } from "../components/ExperienceItem";
import Magnetic from "../components/Magnetic";
import { IconEmail, IconGitHub, IconLinkedIn } from "../components/Icons";

import profileData from "../data/profile.json";
import projectsData from "../data/projects.json";
import experienceData from "../data/experience.json";

export default function Page() {
  // ---------------- Filters (fixed set, includes CAD + Embedded)
  const filters = ["all", "AI", "Web", "Embedded", "CAD"] as const;
  type Filter = typeof filters[number];

  // state must use lowercase "all" to match the union type
  const [filter, setFilter] = useState<Filter>("all");
  const [typedTitle, setTypedTitle] = useState("");
  const [typedSubtitle, setTypedSubtitle] = useState("");

  // ---------------- Hero (parallax blobs)
  const heroRef = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLSpanElement>(null);
  const l2 = useRef<HTMLSpanElement>(null);
  const l3 = useRef<HTMLSpanElement>(null);

  // ---------------- Data
  const projects = projectsData as Project[];
  const experience = experienceData as Experience[];
  const profile = profileData as any;

  // smart matcher: project matches if category OR tags contain the filter keyword
  const matchesFilter = (p: Project, f: Filter) => {
    if (f === "all") return true;
    const cat = (p.category || "").toLowerCase();
    const tags = (p.tags || []).map((t) => String(t).toLowerCase());
    if (f === "AI") return cat.includes("ai") || tags.includes("ai");
    if (f === "Web") return cat.includes("web") || tags.includes("web");
    if (f === "Embedded") return cat.includes("embedded") || tags.includes("embedded");
    if (f === "CAD") return cat.includes("cad") || tags.includes("cad");
    return false;
  };

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilter(p, filter)),
    [projects, filter]
  );

  // ---------------- Typing animation
  useEffect(() => {
    const title = "Ali Husseini";
    const subtitle = "Mechatronics Engineering @ the University of Waterloo";

    let i = 0;
    let j = 0;
    setTypedTitle("");
    setTypedSubtitle("");

    const ti = setInterval(() => {
      setTypedTitle(title.slice(0, ++i));
      if (i >= title.length) {
        clearInterval(ti);
        const si = setInterval(() => {
          setTypedSubtitle(subtitle.slice(0, ++j));
          if (j >= subtitle.length) clearInterval(si);
        }, 35);
      }
    }, 80);

    return () => {
      // nothing to clean here
    };
  }, []);

  // ---------------- Parallax blobs (mouse + scroll)
  useEffect(() => {
    const move = (x: number, y: number) => {
      if (l1.current) l1.current.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
      if (l2.current) l2.current.style.transform = `translate(${x * -10}px, ${y * -7}px)`;
      if (l3.current) l3.current.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
    };

    const onMouse = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const xr = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yr = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      move(xr, yr);
    };

    const onScroll = () => {
      const y = window.scrollY;
      move(0, Math.min(1, y / 800) * 0.6);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ---------------- Contact data (personal email only)
  const email = (profile.personalEmail || "ahusseini007@gmail.com") as string;
  const github = (profile.github || "https://github.com/alihusseini07") as string;

  // nice touch: smooth scroll to top when filter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter]);

  // ---------------- RENDER (no stray characters before return)
  return (
    <main>
      {/* HERO */}
      <section ref={heroRef} className="container pt-16 pb-10 hero-wrap">
        <div className="hero-bg">
          <span ref={l1} className="hero-l1" />
          <span ref={l2} className="hero-l2" />
          <span ref={l3} className="hero-l3" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Text block */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gradient-teal select-none">
              {typedTitle}
            </h1>
            <p className="mt-2 text-lg md:text-xl hero-sub select-none">{typedSubtitle}</p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <Magnetic>
                <a
                  className="btn-outline"
                  href={`mailto:${email}`}
                  aria-label="Email"
                  title="Email"
                >
                  <IconEmail />
                </a>
              </Magnetic>
              {profile.linkedin && (
                <Magnetic>
                  <a
                    className="btn-outline"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <IconLinkedIn />
                  </a>
                </Magnetic>
              )}
              <Magnetic>
                <a
                  className="btn-outline"
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <IconGitHub />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <Section id="overview" title="Overview">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-8 card p-6 overview-card">
            <div className="grid gap-4">
              <p className="text-lg leading-relaxed">
                👋 Hey! I’m Ali, a Mechatronics Engineering student at the University of Waterloo
                who enjoys turning rough ideas into practical, well thought out systems that
                actually work in the real world.
              </p>
              <ul className="overview-list grid gap-3">
                <li>
                  🧩 I’ve worked across software, hardware, and AI driven projects, from building
                  tools like Joblyze to designing and iterating on robotics systems. I like
                  breaking down messy problems, structuring them clearly, and shipping something
                  usable instead of overengineering from the start.
                </li>
                <li>
                  ⚙️ Interests: applied AI, workflow tools, structured problem solving, clean
                  system design, and improving ideas through iteration rather than settling for the
                  first solution.
                </li>
                <li>
                  🤝 Outside of coursework, I enjoy staying active with kickboxing and the gym. I've 
                  tutored math and science, which has shaped how I communicate technical ideas to non 
                  technical audiences. I care a lot about clarity, empathy, and making sure people actually 
                  understand what’s being built and why.
                </li>
                <li>
                  🚀 I’m especially drawn to startup environments and fast moving teams where
                  learning by doing, ownership, and collaboration matter more than titles or
                  experience level.
                </li>
                <li>📍 Based in Ontario, Canada.</li>
              </ul>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex items-center justify-center">
            <Image
              src="/assets/ali-headshot.jpg"
              alt="Ali Husseini headshot"
              width={240}
              height={240}
              className="avatar overview-photo"
              priority
            />
          </div>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects">
        <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="grid grid-cols-12 gap-4">
          {filtered.map((p, i) => (
            <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4">
              <ProjectCard p={p} />
            </div>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience">
        <div className="grid gap-3">
          {experience.map((xp, i) => (
            <ExperienceItem key={i} xp={xp} />
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills, Tools & Certifications">
        <div className="grid grid-cols-12 gap-3">
          {[
            { title: "Skills", items: profile.skills },
            { title: "Tools", items: profile.tools },
            { title: "Certifications", items: profile.certifications },
          ].map((g, gi) => (
            <div
              key={gi}
              className="col-span-12 md:col-span-4 card p-4 card-hover"
            >
              <h3 className="font-semibold mb-2 text-gradient-teal">
                {g.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it: string, ii: number) => (
                  <span key={ii} className="badge">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* EDUCATION */}
      <Section id="education" title="Education">
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-sm font-semibold">
                UW
              </div>
              <div>
                <div className="text-xl font-semibold text-gradient-teal">University of Waterloo</div>
                <div className="text-muted">
                  BASc, Mechatronics Engineering • Waterloo, Ontario, Canada
                </div>
              </div>
            </div>
            <span className="badge">Sept 2025 – Apr 2030</span>
          </div>
          <p className="mt-4 text-muted">
            Relevant coursework: Programming (C++, OOP), Applied Math (Python, Linear Algebra),
            Engineering Design (AutoCAD, SolidWorks).
          </p>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact">
        <form
          className="max-w-xl mx-auto card p-6 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const name = String(data.get("name") || "");
            const mail = String(data.get("email") || email);
            const message = String(data.get("message") || "");
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${mail}\n\n${message}`);
            window.location.href = `mailto:${email}?subject=Portfolio%20Inquiry&body=${body}`;
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Your name"
              required
              className="btn-outline !justify-start w-full"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              className="btn-outline !justify-start w-full"
            />
          </div>
          <textarea
            name="message"
            placeholder="Your message"
            rows={6}
            required
            className="btn-outline !justify-start w-full"
          />
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </form>
      </Section>
    </main>
  );
}
