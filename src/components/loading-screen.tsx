import { motion } from "framer-motion";
import ornament from "@/assets/ornament.png";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background">
      <motion.img
        src={ornament}
        alt=""
        className="h-24 w-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div className="mt-8 h-px w-48 overflow-hidden bg-border">
        <motion.div
          className="h-full"
          style={{ background: "var(--gradient-gold)" }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
