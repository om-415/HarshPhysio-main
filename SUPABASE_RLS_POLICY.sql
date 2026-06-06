-- Enable Row Level Security for production-safe access.
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Grants for the anonymous public role.
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT INSERT ON public.bookings TO anon;

-- Reviews policies
CREATE POLICY "Public can select reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Public can insert reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public cannot update reviews"
  ON public.reviews
  FOR UPDATE
  USING (false);

CREATE POLICY "Public cannot delete reviews"
  ON public.reviews
  FOR DELETE
  USING (false);

-- Bookings policies
CREATE POLICY "Public can insert bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (
    auth.role() = 'anon'
    AND phone IS NOT NULL
    AND phone <> ''
    AND treatment_type IS NOT NULL
    AND treatment_type <> ''
  );

CREATE POLICY "Public cannot select bookings"
  ON public.bookings
  FOR SELECT
  USING (false);

CREATE POLICY "Public cannot update bookings"
  ON public.bookings
  FOR UPDATE
  USING (false);

CREATE POLICY "Public cannot delete bookings"
  ON public.bookings
  FOR DELETE
  USING (false);
