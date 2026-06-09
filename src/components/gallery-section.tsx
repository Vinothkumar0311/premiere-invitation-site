import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeading } from "./section-heading";

type Img = { id: string; image_url: string; caption: string | null };

export function GallerySection({ images }: { images: Img[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <section id="gallery" className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="Memories" title="Gallery">A glimpse of our journey together.</SectionHeading>
          <p className="text-center text-muted-foreground">Photos coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="Memories" title="Our Gallery">A glimpse of our journey together.</SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className={`group relative overflow-hidden rounded-2xl shadow-luxury ${i % 5 === 0 ? "row-span-2 aspect-[3/4] sm:row-span-2" : "aspect-square"}`}
            >
              <img src={img.image_url} alt={img.caption || ""} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-4 right-4 text-white" onClick={() => setActive(null)} aria-label="Close">
              <X className="h-7 w-7" />
            </button>
            <motion.img
              key={active}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={images[active].image_url}
              alt={images[active].caption || ""}
              className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
