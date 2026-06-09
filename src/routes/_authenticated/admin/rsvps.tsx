import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/rsvps")({
  component: RsvpsAdmin,
});

function RsvpsAdmin() {
  const qc = useQueryClient();
  const { data: rsvps = [] } = useQuery({
    queryKey: ["rsvps"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rsvps").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rsvps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["rsvps"] }); },
  });

  const exportXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(rsvps.map((r) => ({
      Name: r.name,
      Attending: r.attending ? "Yes" : "No",
      Guests: r.guest_count,
      Message: r.message ?? "",
      Date: new Date(r.created_at).toLocaleString(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RSVPs");
    XLSX.writeFile(wb, `rsvps-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const attendingCount = rsvps.filter((r) => r.attending).reduce((s, r) => s + r.guest_count, 0);
  const decliningCount = rsvps.filter((r) => !r.attending).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Guest Responses</h1>
          <p className="mt-1 text-muted-foreground">{rsvps.length} total · {attendingCount} attending · {decliningCount} declined</p>
        </div>
        <Button onClick={exportXlsx} disabled={!rsvps.length} className="text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
          <Download className="h-4 w-4 mr-2" /> Export Excel
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Attending</th>
              <th className="px-4 py-3 font-medium">Guests</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">
                  {r.attending ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-destructive" />}
                </td>
                <td className="px-4 py-3">{r.guest_count}</td>
                <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">{r.message || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => del.mutate(r.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No RSVPs yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
