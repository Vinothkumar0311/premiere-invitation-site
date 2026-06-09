
DROP POLICY "Anyone can submit RSVP" ON public.rsvps;
CREATE POLICY "Anyone can submit RSVP" ON public.rsvps FOR INSERT
  WITH CHECK (length(trim(name)) BETWEEN 1 AND 100 AND guest_count BETWEEN 1 AND 20);

-- Storage policies on gallery bucket
CREATE POLICY "Public can read gallery objects" ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload to gallery" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gallery objects" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery objects" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
