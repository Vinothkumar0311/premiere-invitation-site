import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";

export function MusicPlayer({ src, autoPlay }: { src: string; autoPlay?: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (autoPlay && ref.current) {
      ref.current.volume = 0.4;
      ref.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [autoPlay]);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.volume = 0.4; ref.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <>
      <audio ref={ref} src={src} loop preload="auto" />
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground shadow-gold"
        style={{ background: "var(--gradient-gold)" }}
      >
        <motion.div animate={playing ? { rotate: 360 } : {}} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          {playing ? <Pause className="h-5 w-5" /> : <Music className="h-5 w-5" />}
        </motion.div>
      </motion.button>
    </>
  );
}
