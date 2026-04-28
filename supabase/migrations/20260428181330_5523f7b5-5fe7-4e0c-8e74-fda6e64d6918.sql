
-- Length / format limits to block spam and oversized payloads.
ALTER TABLE public.quote_requests
  ADD CONSTRAINT quote_requests_lengths_chk CHECK (
    char_length(service_type) BETWEEN 1 AND 50
    AND char_length(pickup_address) BETWEEN 1 AND 500
    AND char_length(delivery_address) BETWEEN 1 AND 500
    AND (dimensions IS NULL OR char_length(dimensions) <= 200)
    AND (description IS NULL OR char_length(description) <= 2000)
    AND (company IS NULL OR char_length(company) <= 200)
    AND char_length(contact_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(phone) BETWEEN 4 AND 40
    AND (weight_kg IS NULL OR (weight_kg >= 0 AND weight_kg <= 1000000))
  );

-- Simple per-email rate limit: max 5 submissions / 10 minutes.
CREATE OR REPLACE FUNCTION public.enforce_quote_request_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT count(*) INTO recent_count
  FROM public.quote_requests
  WHERE email = NEW.email
    AND created_at > now() - INTERVAL '10 minutes';

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded for this email. Please try again later.'
      USING ERRCODE = '22023';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER quote_requests_rate_limit
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_quote_request_rate_limit();
