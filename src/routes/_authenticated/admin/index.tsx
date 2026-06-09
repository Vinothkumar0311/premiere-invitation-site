import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image as ImageIcon, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [rsvps, images, attending] = await Promise.all([
        supabase.from("rsvps").select("*", { count: "exact", head: true }),
        supabase.from("gallery_images").select("*", { count: "exact", head: true }),
        supabase.from("rsvps").select("guest_count").eq("attending", true),
      ]);
      const guests = attending.data?.reduce((s, r) => s + r.guest_count, 0) ?? 0;
      return { rsvps: rsvps.count ?? 0, images: images.count ?? 0, guests };
    },
  });

  const cards = [
    { label: "Total RSVPs", value: stats?.rsvps ?? "—", icon: Users, to: "/admin/rsvps" },
    { label: "Confirmed Guests", value: stats?.guests ?? "—", icon: Users, to: "/admin/rsvps" },
    { label: "Gallery Images", value: stats?.images ?? "—", icon: ImageIcon, to: "/admin/gallery" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your wedding invitation.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="glass rounded-2xl p-6 transition hover:shadow-luxury">
            <c.icon className="h-6 w-6 text-[var(--gold)]" />
            <p className="mt-4 text-3xl font-display">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/admin/content" className="glass flex items-center gap-3 rounded-2xl p-5 hover:shadow-luxury">
          <FileText className="h-5 w-5 text-[var(--gold)]" />
          <div><p className="font-medium">Edit Content</p><p className="text-xs text-muted-foreground">Names, dates, story, venue, contact</p></div>
        </Link>
        <Link to="/admin/gallery" className="glass flex items-center gap-3 rounded-2xl p-5 hover:shadow-luxury">
          <ImageIcon className="h-5 w-5 text-[var(--gold)]" />
          <div><p className="font-medium">Manage Gallery</p><p className="text-xs text-muted-foreground">Upload and remove photos</p></div>
        </Link>
      </div>
    </div>
  );
}
