"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

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
  const scrollingToRef = useRef<string | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const byDistance = items
        .map((item) => {
          const el = document.querySelector(item.url) as HTMLElement | null
          return {
            name: item.name,
            top: el ? Math.abs(el.getBoundingClientRect().top) : Infinity,
          }
        })
        .sort((a, b) => a.top - b.top)

      const nearest = byDistance[0]?.name
      if (!nearest) return

      // If we're mid-programmatic-scroll, don't override the clicked tab
      // until we've actually arrived at the target section
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

  const smoothTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    name: string,
  ) => {
    const el = document.querySelector(url)
    if (!el) return
    e.preventDefault()

    // Lock active tab immediately; scroll-spy won't override until arrival
    scrollingToRef.current = name
    setActiveTab(name)

    // Fallback: release the lock after 1.5s in case scroll ends early
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      scrollingToRef.current = null
    }, 1500)

    el.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", url)
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6",
        className,
      )}
    >
      <div
        className="flex items-center gap-1 py-1 px-1 rounded-full shadow-lg"
        style={{
          background: "rgba(6,11,18,.8)",
          border: "1px solid rgba(255,255,255,.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,.5), 0 0 0 1px rgba(34,211,238,.06)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => smoothTo(e, item.url, item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-5 py-2 rounded-full no-underline",
              )}
              style={{
                color: isActive ? "#22d3ee" : "#7a9ab3",
                transition: "color 150ms ease",
              }}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full rounded-full -z-10"
                  style={{ background: "rgba(34,211,238,.07)" }}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full"
                    style={{
                      background: "linear-gradient(135deg, #22d3ee, #34d399)",
                    }}
                  >
                    <div
                      className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2"
                      style={{ background: "rgba(34,211,238,.18)" }}
                    />
                    <div
                      className="absolute w-8 h-6 rounded-full blur-md -top-1"
                      style={{ background: "rgba(34,211,238,.15)" }}
                    />
                    <div
                      className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2"
                      style={{ background: "rgba(34,211,238,.12)" }}
                    />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
