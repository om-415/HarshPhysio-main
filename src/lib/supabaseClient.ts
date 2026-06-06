import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  console.warn(
    "Supabase environment variables are not set. Realtime features will be disabled.",
  );
}

export const supabase = createClient(url, key, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export default supabase;
