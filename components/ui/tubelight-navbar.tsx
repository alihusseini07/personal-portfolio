"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue, animate } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

type Edge = "top" | "bottom" | "left" | "right"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [docked, setDocked] = useState<Edge>("top")
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const pendingEdgeRef = useRef<Edge>("top")
  const navRef = useRef<HTMLDivElement>(null)
  const scrollingToRef = useRef<string | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Detect mobile (<768px) — disable drag on mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const doSnap = useCallback(
    (edge: Edge) => {
      if (!navRef.current) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      const w = navRef.current.offsetWidth
      const h = navRef.current.offsetHeight

      let tx = 0, ty = 0
      switch (edge) {
        case "top":    tx = (vw - w) / 2; ty = 16;           break
        case "bottom": tx = (vw - w) / 2; ty = vh - h - 24;  break
        case "left":   tx = 16;            ty = (vh - h) / 2; break
        case "right":  tx = vw - w - 16;  ty = (vh - h) / 2; break
      }
      animate(x, tx, { type: "spring", stiffness: 420, damping: 36 })
      animate(y, ty, { type: "spring", stiffness: 420, damping: 36 })
    },
    [x, y],
  )

  // Initial desktop position — instant (no spring) so it never slides from top-left
  useEffect(() => {
    if (isMobile || !navRef.current) return
    const vw = window.innerWidth
    const w = navRef.current.offsetWidth
    x.set((vw - w) / 2)
    y.set(16)
    setIsReady(true)
  }, [isMobile, x, y])

  // Re-snap after docked state changes (layout updated, new size)
  const [snapSeq, setSnapSeq] = useState(0)
  useEffect(() => {
    if (snapSeq === 0 || isMobile) return
    const raf = requestAnimationFrame(() => doSnap(pendingEdgeRef.current))
    return () => cancelAnimationFrame(raf)
  }, [snapSeq, doSnap, isMobile])

  // Re-snap on resize (desktop only)
  useEffect(() => {
    if (isMobile) return
    const onResize = () => {
      if (!isReady) return
      doSnap(pendingEdgeRef.current)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [isMobile, isReady, doSnap])

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const byDistance = items
        .map((item) => {
          const el = document.querySelector(item.url) as HTMLElement | null
          return { name: item.name, top: el ? Math.abs(el.getBoundingClientRect().top) : Infinity }
        })
        .sort((a, b) => a.top - b.top)

      const nearest = byDistance[0]?.name
      if (!nearest) return
      if (scrollingToRef.current) {
        if (nearest === scrollingToRef.current) {
          scrollingToRef.current = null
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        }
        return
      }
      setActiveTab(nearest)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  const smoothTo = (e: React.MouseEvent<HTMLAnchorElement>, url: string, name: string) => {
    const el = document.querySelector(url)
    if (!el) return
    e.preventDefault()
    scrollingToRef.current = name
    setActiveTab(name)
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => { scrollingToRef.current = null }, 1500)
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", url)
  }

  const handleDragEnd = () => {
    if (!navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const vw = window.innerWidth
    const vh = window.innerHeight

    const dists: Record<Edge, number> = {
      top: cy, bottom: vh - cy, left: cx, right: vw - cx,
    }
    const nearest = (Object.entries(dists) as [Edge, number][])
      .reduce((a, b) => a[1] < b[1] ? a : b)[0]

    pendingEdgeRef.current = nearest
    setDocked(nearest)
    setSnapSeq((s) => s + 1)
  }

  const isVertical = !isMobile && (docked === "left" || docked === "right")

  const getLampStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      background: "linear-gradient(135deg, #68BA7F, #4a9960)",
    }
    if (isMobile || docked === "bottom")
      return { ...base, top: "-8px", left: "50%", transform: "translateX(-50%)", width: "32px", height: "4px", borderRadius: "4px 4px 0 0" }
    if (docked === "top")  // lamp points down toward content
      return { ...base, bottom: "-8px", left: "50%", transform: "translateX(-50%)", width: "32px", height: "4px", borderRadius: "0 0 4px 4px" }
    if (docked === "left")
      return { ...base, right: "-8px", top: "50%", transform: "translateY(-50%)", width: "4px", height: "24px", borderRadius: "0 4px 4px 0" }
    return   { ...base, left: "-8px", top: "50%", transform: "translateY(-50%)", width: "4px", height: "24px", borderRadius: "4px 0 0 4px" }
  }

  // Shared pill content
  const pillContent = (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",
        gap: "4px",
        padding: "4px",
        background: "rgba(6,11,18,.88)",
        border: "1px solid rgba(255,255,255,.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: isVertical ? "18px" : "9999px",
        boxShadow: "0 4px 24px rgba(0,0,0,.55), 0 0 0 1px rgba(104,186,127,.07)",
      }}
    >
      {/* Drag grip — desktop only */}
      {!isMobile && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 3px)",
            gap: "3px",
            padding: isVertical ? "6px 10px" : "10px 6px",
            opacity: 0.22,
            flexShrink: 0,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#68BA7F" }} />
          ))}
        </div>
      )}

      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.name

        return (
          <a
            key={item.name}
            href={item.url}
            onClick={(e) => smoothTo(e, item.url, item.name)}
            className={cn(
              "relative text-sm font-semibold no-underline flex items-center justify-center",
              isVertical ? "rounded-xl" : "rounded-full",
            )}
            style={{
              padding: isVertical ? "10px 14px" : "8px 20px",
              color: isActive ? "#68BA7F" : "#4a7a55",
              transition: "color 150ms ease",
              cursor: "pointer",
            }}
          >
            {!isVertical && (
              <>
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden"><Icon size={18} strokeWidth={2.5} /></span>
              </>
            )}
            {isVertical && <Icon size={18} strokeWidth={2.5} />}

            {isActive && (
              <motion.div
                layoutId="lamp"
                className="absolute inset-0 -z-10"
                style={{ borderRadius: "inherit", background: "rgba(104,186,127,.07)" }}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div style={getLampStyle()}>
                  <div style={{
                    position: "absolute", width: "48px", height: "20px",
                    borderRadius: "50%", filter: "blur(10px)",
                    top: "-4px", left: "-8px", background: "rgba(104,186,127,.2)",
                  }} />
                </div>
              </motion.div>
            )}
          </a>
        )
      })}
    </div>
  )

  // Mobile: static, fixed at bottom center — no drag
  if (isMobile) {
    return (
      <div
        className={cn("fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6", className)}
      >
        {pillContent}
      </div>
    )
  }

  // Desktop: draggable with edge snap
  return (
    <motion.div
      ref={navRef}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ x, y, position: "fixed", top: 0, left: 0, zIndex: 50, touchAction: "none", visibility: isReady ? "visible" : "hidden" }}
      whileDrag={{ scale: 1.04, opacity: 0.88 }}
      className={cn("cursor-grab select-none active:cursor-grabbing", className)}
    >
      {pillContent}
    </motion.div>
  )
}
