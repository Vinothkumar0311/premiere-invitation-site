import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getGuestName } from "@/lib/personalize";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  attending: z.boolean(),
  guest_count: z.number().int().min(1).max(20),
  message: z.string().max(500).optional(),
});

export function RsvpForm() {
  const [name, setName] = useState(getGuestName());
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse({ name, attending, guest_count: guestCount, message: message || undefined });
      const { error } = await supabase.from("rsvps").insert(parsed);
      if (error) throw error;
    },
    onSuccess: () => { setDone(true); toast.success("Thank you for your RSVP!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-10 text-center">
        <p className="font-script text-3xl text-gradient-gold">Thank you</p>
        <p className="mt-4 text-foreground">Your response has been received. We can't wait to celebrate with you.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="glass rounded-3xl p-6 sm:p-10 space-y-5">
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className="mt-1.5" />
      </div>
      <div>
        <Label>Will you attend?</Label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[{ v: true, l: "Joyfully Accept" }, { v: false, l: "Regretfully Decline" }].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => setAttending(o.v)}
              className={`rounded-xl border px-4 py-3 text-sm transition ${attending === o.v ? "border-[var(--gold)] bg-[var(--gold)]/10 text-foreground" : "border-border text-muted-foreground hover:border-[var(--gold)]/50"}`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>
      {attending && (
        <div>
          <Label htmlFor="count">Number of Guests</Label>
          <Input id="count" type="number" min={1} max={20} value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)} className="mt-1.5" />
        </div>
      )}
      <div>
        <Label htmlFor="msg">Message (optional)</Label>
        <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={3} className="mt-1.5" />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
        {mutation.isPending ? "Sending..." : "Send RSVP"}
      </Button>
    </form>
  );
}
