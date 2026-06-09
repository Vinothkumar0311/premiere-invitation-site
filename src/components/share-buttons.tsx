import { Share2, MessageCircle, Link2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function ShareButtons({ title }: { title: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      copy();
    }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    catch { toast.error("Could not copy"); }
  };
  const whatsapp = () => {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const items = [
    { icon: Share2, label: "Share", onClick: share },
    { icon: MessageCircle, label: "WhatsApp", onClick: whatsapp },
    { icon: Link2, label: "Copy", onClick: copy },
  ];

  return (
    <div className="flex justify-center gap-3">
      {items.map((it) => (
        <motion.button
          key={it.label}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={it.onClick}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground"
        >
          <it.icon className="h-4 w-4 text-[var(--gold)]" />
          {it.label}
        </motion.button>
      ))}
    </div>
  );
}
