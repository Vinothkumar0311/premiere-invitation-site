import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { galleryQuery } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const qc = useQueryClient();
  const { data: images = [] } = useQuery(galleryQuery);
  const [externalUrl, setExternalUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["gallery"] });

  const remove = useMutation({
    mutationFn: async (item: { id: string; image_url: string }) => {
      const { data: rows } = await supabase.from("gallery_images").select("image_url").eq("id", item.id).single();
      const raw = rows?.image_url ?? "";
      if (raw && !raw.startsWith("http")) {
        await supabase.storage.from("gallery").remove([raw]);
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Removed"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const addExternal = useMutation({
    mutationFn: async () => {
      if (!externalUrl.trim()) throw new Error("URL required");
      const { error } = await supabase.from("gallery_images").insert({ image_url: externalUrl.trim(), caption: caption || null, sort_order: images.length });
      if (error) throw error;
    },
    onSuccess: () => { setExternalUrl(""); setCaption(""); toast.success("Added"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { error: dbErr } = await supabase.from("gallery_images").insert({ image_url: path, caption: null, sort_order: images.length });
        if (dbErr) throw dbErr;
      }
      toast.success("Uploaded");
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Gallery</h1>
      <p className="mt-1 text-muted-foreground">Upload images or add by URL.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-medium">Upload from device</h3>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-sm text-muted-foreground hover:border-[var(--gold)]">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Choose files"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-medium">Add by URL</h3>
          <div className="mt-3 space-y-2">
            <Input placeholder="https://..." value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
            <Input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <Button onClick={() => addExternal.mutate()} disabled={addExternal.isPending} className="w-full">Add</Button>
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl">Current Images ({images.length})</h2>
      {images.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No images yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl">
              <img src={img.image_url} alt={img.caption || ""} className="aspect-square w-full object-cover" />
              <button onClick={() => remove.mutate(img)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                <Trash2 className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
