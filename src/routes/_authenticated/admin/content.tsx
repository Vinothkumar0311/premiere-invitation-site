import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { siteContentQuery, type SiteContent } from "@/lib/site-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentEditor,
});

const fields: { key: keyof SiteContent; label: string; type?: "textarea" | "datetime-local" | "url" }[] = [
  { key: "bride_name", label: "Bride Name" },
  { key: "groom_name", label: "Groom Name" },
  { key: "wedding_date", label: "Wedding Date & Time", type: "datetime-local" },
  { key: "hero_tagline", label: "Hero Tagline" },
  { key: "venue_name", label: "Venue Name" },
  { key: "venue_address", label: "Venue Address" },
  { key: "story", label: "Our Story", type: "textarea" },
  { key: "ceremony_date", label: "Ceremony Date" },
  { key: "ceremony_time", label: "Ceremony Time" },
  { key: "ceremony_dress_code", label: "Ceremony Dress Code" },
  { key: "reception_date", label: "Reception Date" },
  { key: "reception_time", label: "Reception Time" },
  { key: "reception_dress_code", label: "Reception Dress Code" },
  { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_whatsapp", label: "WhatsApp (with country code, no +)" },
  { key: "contact_email", label: "Contact Email" },
  { key: "map_embed_url", label: "Google Maps Embed URL", type: "url" },
  { key: "music_url", label: "Background Music URL", type: "url" },
  { key: "hero_image_url", label: "Hero Image URL (leave empty for default)", type: "url" },
];

function ContentEditor() {
  const qc = useQueryClient();
  const { data } = useQuery(siteContentQuery);
  const [form, setForm] = useState<SiteContent | null>(null);

  useEffect(() => { if (data && !form) setForm(data); }, [data]);

  const mutation = useMutation({
    mutationFn: async (next: SiteContent) => {
      const { error } = await supabase.from("site_content").update({ data: next as any, updated_at: new Date().toISOString() }).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Content saved"); qc.invalidateQueries({ queryKey: ["site_content"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!form) return <div className="text-muted-foreground">Loading…</div>;

  const set = (k: keyof SiteContent, v: string) => setForm({ ...form, [k]: v });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}>
      <h1 className="font-display text-3xl">Site Content</h1>
      <p className="mt-1 text-muted-foreground">Edit text shown on your invitation.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea id={f.key} value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={4} className="mt-1.5" />
            ) : (
              <Input id={f.key} type={f.type === "datetime-local" ? "datetime-local" : "text"} value={f.type === "datetime-local" ? toDateTimeLocal(form[f.key]) : (form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} className="mt-1.5" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={mutation.isPending} className="text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function toDateTimeLocal(v: string) {
  try { return new Date(v).toISOString().slice(0, 16); } catch { return v; }
}
