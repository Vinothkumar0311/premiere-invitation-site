
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Site content (singleton JSON document)
CREATE TABLE public.site_content (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_content_singleton CHECK (id = 1)
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Gallery
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Timeline
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.timeline_events TO authenticated;
GRANT ALL ON public.timeline_events TO service_role;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view timeline" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Admins can manage timeline" ON public.timeline_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RSVPs
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INT NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvps TO anon, authenticated;
GRANT SELECT, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit RSVP" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view RSVPs" ON public.rsvps FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete RSVPs" ON public.rsvps FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed default content
INSERT INTO public.site_content (id, data) VALUES (1, '{
  "bride_name": "Aaradhya",
  "groom_name": "Arjun",
  "wedding_date": "2026-12-15T18:00:00",
  "venue_name": "The Leela Palace, Udaipur",
  "venue_address": "Lake Pichola, Udaipur, Rajasthan",
  "hero_tagline": "Two souls, one journey",
  "story": "What began as a chance meeting at a friend''s wedding bloomed into a love story written across cities and seasons. From quiet morning coffees to grand adventures, every moment has led us here — ready to begin forever.",
  "ceremony_date": "December 15, 2026",
  "ceremony_time": "6:00 PM",
  "ceremony_dress_code": "Traditional Indian Attire",
  "reception_date": "December 16, 2026",
  "reception_time": "7:30 PM",
  "reception_dress_code": "Cocktail Formal",
  "contact_phone": "+91 98765 43210",
  "contact_whatsapp": "919876543210",
  "contact_email": "hello@example.com",
  "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3636.0!2d73.6792!3d24.5760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM0JzMzLjYiTiA3M8KwNDAnNDUuMSJF!5e0!3m2!1sen!2sin!4v1700000000000",
  "music_url": "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  "hero_image_url": ""
}'::jsonb);

INSERT INTO public.timeline_events (time_label, title, description, sort_order) VALUES
('4:00 PM', 'Baraat Arrival', 'Welcome the groom''s procession with music and dance', 1),
('5:30 PM', 'Welcome Ceremony', 'Traditional greeting and varmala exchange', 2),
('6:30 PM', 'Sacred Vows', 'The wedding ceremony begins under the mandap', 3),
('8:00 PM', 'Cocktail Hour', 'Drinks, hors d''oeuvres, and live music', 4),
('9:00 PM', 'Dinner & Dancing', 'A feast under the stars followed by celebration', 5);
