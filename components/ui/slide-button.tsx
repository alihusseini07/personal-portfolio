"use client"

import React, {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9

const BUTTON_STATES = {
  initial: { width: "12rem" },
  completed: { width: "8rem" },
}

const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
} as const

type SlideStatus = "idle" | "loading" | "success" | "error"

const StatusIcon: React.FC<{ status: SlideStatus }> = ({ status }) => {
  const iconMap: Partial<Record<SlideStatus, JSX.Element>> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={20} />,
      success: <Check size={20} />,
      error: <X size={20} />,
    }),
    []
  )

  const icon = iconMap[status]
  if (!icon) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {icon}
    </motion.div>
  )
}

interface SlideButtonProps extends Omit<ButtonProps, "onSubmit"> {
  /** Synchronous check before committing. Return false to snap back immediately. */
  validate?: () => boolean
  /** Called after validation passes. Return true = success, false = server error. */
  onSlideComplete?: () => Promise<boolean>
  label?: string
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, validate, onSlideComplete, label = "Slide to send", ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [status, setStatus] = useState<SlideStatus>("idle")
    const dragHandleRef = useRef<HTMLDivElement | null>(null)

    const dragX = useMotionValue(0)
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
    const dragProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

    const handleDragStart = () => {
      if (completed) return
      setIsDragging(true)
    }

    const handleDragEnd = async () => {
      if (completed) return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        // Run synchronous validation before committing to completed state
        if (validate && !validate()) {
          dragX.set(0)
          return
        }
        setCompleted(true)
        setStatus("loading")
        if (onSlideComplete) {
          const ok = await onSlideComplete()
          setStatus(ok ? "success" : "error")
        } else {
          setStatus("success")
        }
      } else {
        dragX.set(0)
      }
    }

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed) return
      const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right))
      dragX.set(newX)
    }

    const fillWidth = useTransform(springX, (x) => x)
    const labelOpacity = useTransform(springX, [0, DRAG_CONSTRAINTS.right * 0.6], [1, 0])

    return (
      <motion.div
        animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
        transition={ANIMATION_CONFIG.spring}
        className="relative flex h-10 items-center justify-center rounded-full"
        style={{
          background: "#060b12",
          border: "1px solid rgba(255,255,255,.1)",
        }}
      >
        {/* Label text (fades out as fill grows) */}
        {!completed && (
          <motion.span
            className="pointer-events-none select-none text-xs font-semibold tracking-wide z-[1]"
            style={{
              color: "rgba(255,255,255,.35)",
              opacity: labelOpacity,
            }}
          >
            {label}
          </motion.span>
        )}

        {/* Gradient fill that expands as user drags */}
        {!completed && (
          <motion.div
            style={{
              width: fillWidth,
              background: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)",
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full"
          />
        )}

        {/* Drag handle */}
        <AnimatePresence>
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className="absolute -left-1 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
            >
              <Button
                ref={ref}
                type="button"
                disabled={status === "loading"}
                {...props}
                size="icon"
                className={cn(
                  "rounded-full drop-shadow-xl h-10 w-10",
                  "bg-[linear-gradient(135deg,#22d3ee_0%,#34d399_100%)] text-[#030c14] hover:opacity-95",
                  isDragging && "scale-105 transition-transform",
                  className
                )}
              >
                <SendHorizontal className="size-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed state — shows loading/success/error */}
        <AnimatePresence>
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                ref={ref}
                type="button"
                disabled={status === "loading"}
                {...props}
                className={cn(
                  "size-full rounded-full",
                  "bg-[linear-gradient(135deg,#22d3ee_0%,#34d399_100%)] text-[#030c14]",
                  className
                )}
              >
                <AnimatePresence mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

SlideButton.displayName = "SlideButton"

export { SlideButton }
