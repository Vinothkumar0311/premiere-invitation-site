import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, Mail, MapPin, Calendar, Heart } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import ornament from "@/assets/ornament.png";
import { siteContentQuery, timelineQuery, galleryQuery } from "@/lib/site-data";
import { Countdown } from "./countdown";
import { SectionHeading, FadeIn } from "./section-heading";
import { RsvpForm } from "./rsvp-form";
import { ShareButtons } from "./share-buttons";
import { GallerySection } from "./gallery-section";
import { MusicPlayer } from "./music-player";

export function Invitation({ opened }: { opened: boolean }) {
  const { data: site } = useSuspenseQuery(siteContentQuery);
  const { data: timeline } = useSuspenseQuery(timelineQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroImage = site.hero_image_url || heroImg;
  const title = `${site.bride_name} & ${site.groom_name} — Wedding Invitation`;

  return (
    <div className="relative">
      <MusicPlayer src={site.music_url} autoPlay={opened} />

      {/* HERO */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </motion.div>
        <motion.div style={{ opacity }} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="font-script text-3xl text-gradient-gold sm:text-4xl">
            {site.hero_tagline}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} className="mt-4 font-display text-6xl text-foreground drop-shadow sm:text-8xl">
            {site.bride_name}
            <span className="mx-3 font-script text-4xl text-[var(--gold)]">&</span>
            {site.groom_name}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-8 flex items-center gap-3 text-foreground">
            <span className="h-px w-12 bg-[var(--gold)]" />
            <span className="text-sm uppercase tracking-[0.3em]">{formatDate(site.wedding_date)}</span>
            <span className="h-px w-12 bg-[var(--gold)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1 }} className="mt-16 w-full max-w-md">
            <Countdown date={site.wedding_date} />
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <SectionHeading kicker="Our Story" title="How We Met" />
          <FadeIn>
            <p className="text-center text-lg leading-relaxed text-muted-foreground font-display italic">
              {site.story}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <img src={ornament} alt="" className="h-12 w-12 opacity-70" />
              <Heart className="h-6 w-6 text-[var(--gold)]" fill="currentColor" />
              <img src={ornament} alt="" className="h-12 w-12 opacity-70" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* EVENT DETAILS */}
      <section id="events" className="py-20 px-4" style={{ background: "color-mix(in oklab, var(--gold-soft) 15%, var(--ivory))" }}>
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="Save the Date" title="Wedding Events" />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: "Ceremony", date: site.ceremony_date, time: site.ceremony_time, dress: site.ceremony_dress_code },
              { title: "Reception", date: site.reception_date, time: site.reception_time, dress: site.reception_dress_code },
            ].map((e, i) => (
              <FadeIn key={e.title} delay={i * 0.2}>
                <div className="glass rounded-3xl p-8 text-center shadow-luxury">
                  <img src={ornament} alt="" className="mx-auto h-10 w-10 opacity-70" />
                  <h3 className="mt-4 font-display text-3xl text-gradient-gold">{e.title}</h3>
                  <div className="gold-divider my-5 mx-auto w-24" />
                  <p className="font-display text-xl text-foreground">{e.date}</p>
                  <p className="mt-1 text-muted-foreground">{e.time}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{e.dress}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{site.venue_name}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <SectionHeading kicker="The Day" title="Order of Events" />
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px sm:left-1/2" style={{ background: "linear-gradient(180deg, transparent, var(--gold), transparent)" }} />
            {timeline.map((event, i) => (
              <FadeIn key={event.id} delay={i * 0.1}>
                <div className={`relative mb-8 flex items-start gap-4 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className="absolute left-4 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full sm:left-1/2" style={{ background: "var(--gradient-gold)" }} />
                  <div className={`flex-1 pl-10 sm:pl-0 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                    <div className="glass rounded-2xl p-5">
                      <p className="font-script text-xl text-gradient-gold">{event.time_label}</p>
                      <h4 className="mt-1 font-display text-xl text-foreground">{event.title}</h4>
                      {event.description && <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>}
                    </div>
                  </div>
                  <div className="hidden flex-1 sm:block" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <GallerySection images={gallery} />

      {/* RSVP */}
      <section id="rsvp" className="py-20 px-4" style={{ background: "color-mix(in oklab, var(--blush) 20%, var(--ivory))" }}>
        <div className="mx-auto max-w-xl">
          <SectionHeading kicker="Be Our Guest" title="RSVP">Kindly respond by November 30, 2026.</SectionHeading>
          <FadeIn><RsvpForm /></FadeIn>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="Find Us" title="Venue & Directions" />
          <FadeIn>
            <div className="glass overflow-hidden rounded-3xl shadow-luxury">
              <div className="aspect-video w-full bg-muted">
                <iframe
                  src={site.map_embed_url}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue location"
                />
              </div>
              <div className="p-6 text-center">
                <p className="font-display text-2xl text-foreground">{site.venue_name}</p>
                <p className="mt-1 text-muted-foreground">{site.venue_address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.venue_name + " " + site.venue_address)}`}
                  target="_blank" rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-primary-foreground"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 px-4" style={{ background: "color-mix(in oklab, var(--gold-soft) 12%, var(--ivory))" }}>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading kicker="Reach Out" title="Get in Touch" />
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${site.contact_phone}`} className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm">
                <Phone className="h-4 w-4 text-[var(--gold)]" /> {site.contact_phone}
              </a>
              <a href={`https://wa.me/${site.contact_whatsapp}`} target="_blank" rel="noreferrer" className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm">
                <MessageCircle className="h-4 w-4 text-[var(--gold)]" /> WhatsApp
              </a>
              <a href={`mailto:${site.contact_email}`} className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm">
                <Mail className="h-4 w-4 text-[var(--gold)]" /> Email
              </a>
            </div>
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Share the joy</p>
              <ShareButtons title={title} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 text-center">
        <img src={ornament} alt="" className="mx-auto h-12 w-12 opacity-60" />
        <p className="mt-4 font-display text-2xl text-foreground">
          {site.bride_name} <span className="font-script text-[var(--gold)]">&</span> {site.groom_name}
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Calendar className="h-3 w-3" /> {formatDate(site.wedding_date)}
        </p>
        <p className="mt-6 text-xs text-muted-foreground">Made with love</p>
      </footer>
    </div>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  } catch { return d; }
}
