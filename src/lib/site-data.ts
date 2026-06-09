import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  venue_address: string;
  hero_tagline: string;
  story: string;
  ceremony_date: string;
  ceremony_time: string;
  ceremony_dress_code: string;
  reception_date: string;
  reception_time: string;
  reception_dress_code: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  map_embed_url: string;
  music_url: string;
  hero_image_url: string;
};

export const siteContentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: async (): Promise<SiteContent> => {
    const { data, error } = await supabase.from("site_content").select("data").eq("id", 1).single();
    if (error) throw error;
    return data.data as SiteContent;
  },
});

export const timelineQuery = queryOptions({
  queryKey: ["timeline"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("timeline_events")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    // Resolve storage paths to signed URLs
    const items = await Promise.all(
      data.map(async (item) => {
        if (item.image_url.startsWith("http")) return item;
        const { data: signed } = await supabase.storage
          .from("gallery")
          .createSignedUrl(item.image_url, 60 * 60 * 24 * 30);
        return { ...item, image_url: signed?.signedUrl ?? "" };
      })
    );
    return items;
  },
});
