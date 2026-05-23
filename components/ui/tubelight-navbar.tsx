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
  const pillRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const scrollingToRef = useRef<string | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Single indicator: animate target values
  const [indicatorKey, setIndicatorKey] = useState<"h" | "v">("h") // remount on orientation flip
  const [indicatorAnimate, setIndicatorAnimate] = useState<Record<string, number>>({ x: 0, width: 0 })
  const [indicatorBaseStyle, setIndicatorBaseStyle] = useState<React.CSSProperties>({})

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
        case "top":    tx = (vw - w) / 2; ty = 20;           break
        case "bottom": tx = (vw - w) / 2; ty = vh - h - 20;  break
        case "left":   tx = 20;            ty = (vh - h) / 2; break
        case "right":  tx = vw - w - 20;  ty = (vh - h) / 2; break
      }
      animate(x, tx, { type: "spring", stiffness: 420, damping: 36 })
      animate(y, ty, { type: "spring", stiffness: 420, damping: 36 })
    },
    [x, y],
  )

  useEffect(() => {
    if (isMobile || !navRef.current) return
    const vw = window.innerWidth
    const w = navRef.current.offsetWidth
    x.set((vw - w) / 2)
    y.set(20)
    setIsReady(true)
  }, [isMobile, x, y])

  const [snapSeq, setSnapSeq] = useState(0)
  useEffect(() => {
    if (snapSeq === 0 || isMobile) return
    const raf = requestAnimationFrame(() => doSnap(pendingEdgeRef.current))
    return () => cancelAnimationFrame(raf)
  }, [snapSeq, doSnap, isMobile])

  useEffect(() => {
    if (isMobile) return
    const onResize = () => { if (isReady) doSnap(pendingEdgeRef.current) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [isMobile, isReady, doSnap])

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

  const isVertical = !isMobile && (docked === "left" || docked === "right")

  const measureIndicator = useCallback(() => {
    const activeIndex = items.findIndex(item => item.name === activeTab)
    const activeEl = itemRefs.current[activeIndex]
    const containerEl = pillRef.current
    if (!activeEl || !containerEl) return

    const containerRect = containerEl.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()
    const glow = "0 0 8px rgba(104,186,127,.75)"

    const curDocked = pendingEdgeRef.current
    const vertical = !isMobile && (curDocked === "left" || curDocked === "right")

    if (vertical) {
      setIndicatorKey("v")
      setIndicatorBaseStyle({
        position: "absolute",
        background: "#68BA7F",
        boxShadow: glow,
        width: 2,
        top: 0,
        pointerEvents: "none",
        ...(curDocked === "left" ? { right: 0 } : { left: 0 }),
      })
      setIndicatorAnimate({
        y: itemRect.top - containerRect.top + 4,
        height: itemRect.height - 8,
      })
    } else {
      setIndicatorKey("h")
      setIndicatorBaseStyle({
        position: "absolute",
        background: "#68BA7F",
        boxShadow: glow,
        height: 2,
        left: 0,
        pointerEvents: "none",
        ...(isMobile || curDocked === "bottom" ? { top: 0 } : { bottom: 0 }),
      })
      setIndicatorAnimate({
        x: itemRect.left - containerRect.left + 6,
        width: itemRect.width - 12,
      })
    }
  }, [activeTab, items, isMobile])

  // Re-measure after every render that could shift the indicator
  useEffect(() => {
    const raf = requestAnimationFrame(measureIndicator)
    return () => cancelAnimationFrame(raf)
  }, [measureIndicator])

  // Also re-measure after docked changes (orientation might flip)
  useEffect(() => {
    const raf = requestAnimationFrame(measureIndicator)
    return () => cancelAnimationFrame(raf)
  }, [docked, measureIndicator])

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
    const dists: Record<Edge, number> = { top: cy, bottom: vh - cy, left: cx, right: vw - cx }
    const nearest = (Object.entries(dists) as [Edge, number][]).reduce((a, b) => a[1] < b[1] ? a : b)[0]
    pendingEdgeRef.current = nearest
    setDocked(nearest)
    setSnapSeq((s) => s + 1)
  }

  const pillContent = (
    <div
      ref={pillRef}
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",
        position: "relative",
        background: "rgba(6,11,18,.94)",
        border: "1px solid rgba(104,186,127,.22)",
        borderRadius: "2px",
        boxShadow: "0 0 0 1px rgba(104,186,127,.04), 0 8px 32px rgba(0,0,0,.7)",
      }}
    >
      {/* Corner bracket decorations */}
      <span style={{
        position: "absolute", top: -1, left: -1,
        width: 8, height: 8,
        borderTop: "2px solid rgba(104,186,127,.6)",
        borderLeft: "2px solid rgba(104,186,127,.6)",
        pointerEvents: "none",
      }} />
      <span style={{
        position: "absolute", bottom: -1, right: -1,
        width: 8, height: 8,
        borderBottom: "2px solid rgba(104,186,127,.6)",
        borderRight: "2px solid rgba(104,186,127,.6)",
        pointerEvents: "none",
      }} />

      {/* Single sliding indicator — remounts on orientation flip to reset transform axis */}
      <motion.span
        key={indicatorKey}
        style={indicatorBaseStyle}
        animate={indicatorAnimate}
        initial={false}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      />

      {/* Drag grip */}
      {!isMobile && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 3px)",
          gap: "3px",
          padding: isVertical ? "8px 10px" : "10px 8px",
          opacity: 0.2,
          flexShrink: 0,
          cursor: "grab",
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#68BA7F" }} />
          ))}
        </div>
      )}

      {/* Separator after grip */}
      {!isMobile && (
        <div style={isVertical ? {
          width: "calc(100% - 12px)",
          height: "1px",
          background: "rgba(104,186,127,.12)",
          flexShrink: 0,
          margin: "2px 6px",
        } : {
          width: "1px",
          alignSelf: "stretch",
          background: "rgba(104,186,127,.12)",
          flexShrink: 0,
          margin: "6px 0",
        }} />
      )}

      {items.map((item, idx) => {
        const Icon = item.icon
        const isActive = activeTab === item.name

        return (
          <React.Fragment key={item.name}>
            {idx > 0 && !isVertical && (
              <span style={{
                width: "1px", height: "14px",
                background: "rgba(104,186,127,.1)",
                flexShrink: 0,
              }} />
            )}

            <a
              ref={el => { itemRefs.current[idx] = el }}
              href={item.url}
              onClick={(e) => smoothTo(e, item.url, item.name)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isVertical ? "11px 14px" : "9px 16px",
                textDecoration: "none",
                fontFamily: "var(--font-body, monospace)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: isActive ? "#68BA7F" : "rgba(104,186,127,.38)",
                transition: "color 150ms ease",
                cursor: "pointer",
                userSelect: "none",
                borderRadius: "1px",
                whiteSpace: "nowrap",
              }}
            >
              {/* Active glow bg */}
              {isActive && (
                <motion.span
                  layoutId="nav-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(104,186,127,.05)",
                    borderRadius: "1px",
                    zIndex: 0,
                  }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                />
              )}

              {/* Label — ghost text reserves space so width never changes on active toggle */}
              <span style={{ position: "relative", zIndex: 1 }}>
                {isVertical ? (
                  <Icon size={16} strokeWidth={2} />
                ) : (
                  <>
                    <span className="hidden md:inline" style={{ position: "relative", display: "inline-block" }}>
                      <span style={{ visibility: "hidden", pointerEvents: "none" }}>[{item.name}]</span>
                      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isActive ? `[${item.name}]` : item.name}
                      </span>
                    </span>
                    <span className="md:hidden">
                      <Icon size={16} strokeWidth={2} />
                    </span>
                  </>
                )}
              </span>
            </a>
          </React.Fragment>
        )
      })}
    </div>
  )

  if (isMobile) {
    return (
      <div className={cn("fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6", className)}>
        {pillContent}
      </div>
    )
  }

  return (
    <motion.div
      ref={navRef}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        x, y,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        touchAction: "none",
        visibility: isReady ? "visible" : "hidden",
      }}
      whileDrag={{ scale: 1.03, opacity: 0.85 }}
      className={cn("cursor-grab select-none active:cursor-grabbing", className)}
    >
      {pillContent}
    </motion.div>
  )
}
