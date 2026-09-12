"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

export function AnimatedSection({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.99 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.12, margin: "0px 0px -72px" }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
