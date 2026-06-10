import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ornament from "@/assets/ornament.png";
import { getGuestName } from "@/lib/personalize";

interface Props {
  brideName: string;
  groomName: string;
  onOpen: () => void;
}

export function IntroScreen({ brideName, groomName, onOpen }: Props) {
  const [stage, setStage] = useState<"closed" | "opening" | "revealed">("closed");
  const [guestName, setGuestName] = useState("");
  useEffect(() => { setGuestName(getGuestName()); }, []);

  const handleOpen = () => {
    if (stage !== "closed") return;
    setStage("opening");
    setTimeout(() => setStage("revealed"), 1600);
    setTimeout(onOpen, 3800);
  };

  return (
    <AnimatePresence>
      {stage !== "revealed" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--gold-soft) 35%, var(--background)) 0%, var(--background) 70%)",
          }}
        >
          {/* Floating ornaments */}
          <motion.img
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1, rotate: [0, 8, 0] }}
            transition={{ opacity: { duration: 1.4 }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
            src={ornament}
            alt=""
            className="absolute top-6 left-6 h-24 w-24 opacity-50"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1, rotate: [180, 172, 180] }}
            transition={{ opacity: { duration: 1.4 }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
            src={ornament}
            alt=""
            className="absolute bottom-6 right-6 h-24 w-24 opacity-50"
          />

          {/* Greeting above */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: stage === "opening" ? 0 : 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-10 text-center"
          >
            <p className="font-script text-3xl text-gradient-gold sm:text-4xl">
              {guestName ? `Dear ${guestName}` : "Dearest Guest"}
            </p>
            <p className="mt-2 text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
              You're cordially invited
            </p>
          </motion.div>

          {/* Envelope */}
          <motion.div
            className="relative"
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              onClick={handleOpen}
              whileHover={stage === "closed" ? { scale: 1.02 } : {}}
              whileTap={stage === "closed" ? { scale: 0.98 } : {}}
              animate={
                stage === "opening"
                  ? { y: [-0, -20, -300], opacity: [1, 1, 0], scale: [1, 1, 0.85] }
                  : {}
              }
              transition={{ duration: 1.6, times: [0, 0.4, 1], ease: "easeInOut" }}
              className="relative block w-[300px] sm:w-[380px] cursor-pointer"
              aria-label="Open invitation"
            >
              {/* Envelope body */}
              <div
                className="relative h-[210px] sm:h-[260px] rounded-sm shadow-luxury"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--ivory) 92%, var(--gold-soft)) 0%, color-mix(in oklab, var(--ivory) 78%, var(--gold-soft)) 100%)",
                  border: "1px solid color-mix(in oklab, var(--gold) 50%, transparent)",
                }}
              >
                {/* Bottom triangle fold */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[105px] sm:h-[130px]"
                  style={{
                    background: "linear-gradient(180deg, color-mix(in oklab, var(--ivory) 88%, var(--gold-soft)), color-mix(in oklab, var(--ivory) 70%, var(--gold)))",
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    borderTop: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
                  }}
                />
                {/* Left fold */}
                <div
                  className="absolute inset-y-0 left-0 w-1/2"
                  style={{
                    background: "linear-gradient(135deg, color-mix(in oklab, var(--ivory) 88%, var(--gold-soft)) 0%, color-mix(in oklab, var(--ivory) 95%, transparent) 60%)",
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  }}
                />
                {/* Right fold */}
                <div
                  className="absolute inset-y-0 right-0 w-1/2"
                  style={{
                    background: "linear-gradient(-135deg, color-mix(in oklab, var(--ivory) 88%, var(--gold-soft)) 0%, color-mix(in oklab, var(--ivory) 95%, transparent) 60%)",
                    clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                  }}
                />

                {/* Letter card sliding out */}
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={
                    stage === "opening"
                      ? { y: -180, opacity: 1, scale: 1.05 }
                      : { y: 0, opacity: 0 }
                  }
                  transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-[88%] rounded-sm bg-card p-5 text-center shadow-gold"
                  style={{ border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)" }}
                >
                  <p className="font-script text-xl text-gradient-gold">Save the Date</p>
                  <div className="gold-divider my-2 mx-auto w-20" />
                  <p className="font-display text-lg leading-tight">
                    {brideName} <span className="font-script text-[var(--gold)]">&</span> {groomName}
                  </p>
                </motion.div>

                {/* Top flap (the one that opens) */}
                <motion.div
                  className="absolute inset-x-0 top-0 origin-top h-[105px] sm:h-[130px] z-20"
                  style={{
                    background: "linear-gradient(180deg, color-mix(in oklab, var(--ivory) 95%, var(--gold-soft)) 0%, color-mix(in oklab, var(--ivory) 80%, var(--gold)) 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    borderBottom: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  initial={{ rotateX: 0 }}
                  animate={stage !== "closed" ? { rotateX: -180 } : { rotateX: 0 }}
                  transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                >
                  {/* Wax seal */}
                  <motion.div
                    animate={stage !== "closed" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-gold"
                    style={{
                      background: "radial-gradient(circle at 35% 30%, oklch(0.55 0.18 25), oklch(0.32 0.15 22))",
                      border: "1px solid oklch(0.25 0.1 22)",
                    }}
                  >
                    <span className="font-script text-lg text-[var(--gold-soft)]">
                      {brideName[0]}{groomName[0]}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.button>
          </motion.div>

          {/* CTA */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "closed" ? 1 : 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            Tap the envelope to open
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
