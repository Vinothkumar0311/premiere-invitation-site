import { motion } from "framer-motion";
import type { ReactNode } from "react";
import ornament from "@/assets/ornament.png";

export function SectionHeading({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="mb-12 text-center"
    >
      {kicker && (
        <p className="font-script text-2xl text-gradient-gold">{kicker}</p>
      )}
      <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-[var(--gold)]" />
        <img src={ornament} alt="" className="h-6 w-6 opacity-70" />
        <span className="h-px w-12 bg-[var(--gold)]" />
      </div>
      {children && <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{children}</p>}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, y = 30 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
