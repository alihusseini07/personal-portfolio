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

    let i = 0,
      j = 0;
    setTypedTitle("");
    setTypedSubtitle("");

    const ti = setInterval(() => {
      setTypedTitle(title.slice(0, ++i));
      if (i >= title.length) {
        clearInterval(ti);
        startSubtitle();
      }
    }, 80);

    const startSubtitle = () => {
      const si = setInterval(() => {
        setTypedSubtitle(subtitle.slice(0, ++j));
        if (j >= subtitle.length) clearInterval(si);
      }, 35);
    };

    return () => {};
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
          </div>

          {/* Headshot on the right */}
          <div className="flex-shrink-0">
            <Image
              src="/assets/ali-headshot.jpg" // ensure file exists at /public/assets/ali-headshot.jpg
              alt="Ali Husseini headshot"
              width={140}
              height={140}
              className="avatar w-32 h-32"
              priority
            />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects">
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`chip ${filter === t ? "chip-active" : ""}`}
            >
              {t}
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
      <Section id="experience" title="Experience, Volunteering & Clubs">
        <div className="grid gap-3">
          {experience.map((xp, i) => (
            <ExperienceItem key={i} xp={xp} />
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills, Tools & Certifications">
        <div className="grid grid-cols-12 gap-3">
          {[{ title: "Skills", items: profile.skills }, { title: "Tools", items: profile.tools }, { title: "Certifications", items: profile.certifications }].map((g, gi) => (
            <div
              key={gi}
              className="col-span-12 md:col-span-4 card p-4 card-hover"
              style={{ border: "1px solid color-mix(in oklab, var(--teal) 55%, transparent)" }}
            >
              <h3 className="font-semibold mb-2" style={{ color: "var(--teal)" }}>
                {g.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it: string, ii: number) => (
                  <span key={ii} className="badge">
                    {it}
                  </span>
                ))}
              </div>
