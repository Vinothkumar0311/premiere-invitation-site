import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ornament from "@/assets/ornament.png";
import { getGuestName } from "@/lib/personalize";

interface Props {
  brideName: string;
  groomName: string;
  onOpen: () => void;
}

export function IntroScreen({ brideName, groomName, onOpen }: Props) {
  const [opening, setOpening] = useState(false);
  const guestName = getGuestName();

  const handleOpen = () => {
    setOpening(true);
    setTimeout(onOpen, 1400);
  };

  return (
    <AnimatePresence>
      {!opening && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top, color-mix(in oklab, var(--gold-soft) 30%, transparent), transparent 60%), radial-gradient(ellipse at bottom, color-mix(in oklab, var(--blush) 25%, transparent), transparent 60%)",
          }}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 0.7, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            src={ornament}
            alt=""
            className="absolute top-8 h-32 w-32 opacity-60"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
            animate={{ opacity: 0.7, scale: 1, rotate: 180 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            src={ornament}
            alt=""
            className="absolute bottom-8 h-32 w-32 opacity-60"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-center"
          >
            <p className="font-script text-3xl text-gradient-gold">
              {guestName ? `Welcome, ${guestName}` : "Together with their families"}
            </p>
            <div className="gold-divider my-6 mx-auto w-32" />
            <h1 className="font-display text-5xl leading-tight text-foreground sm:text-7xl">
              {brideName}
              <span className="mx-3 font-script text-3xl text-[var(--gold)]">&</span>
              {groomName}
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              request the pleasure of your company
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleOpen}
            className="group mt-16 relative overflow-hidden rounded-full px-10 py-4 text-sm uppercase tracking-[0.25em] text-primary-foreground shadow-gold"
            style={{ background: "var(--gradient-gold)" }}
          >
            <span className="relative z-10">Open Invitation</span>
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Tap to begin
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
