import fs from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path = ".env") {
  const txt = fs.readFileSync(path, "utf8");
  const lines = txt.split(/\r?\n/);
  for (const l of lines) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (m) {
      const k = m[1];
      let v = m[2];
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      process.env[k] = v;
    }
  }
}

async function run() {
  loadEnv();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE credentials");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log("⚠️  RLS policies are blocking inserts.");
  console.log(
    "\nTo fix this, you MUST manually disable RLS in Supabase Dashboard:\n",
  );
  console.log("1. Go to: https://supabase.com/dashboard");
  console.log("2. Select your project");
  console.log("3. Navigate to: Authentication > Policies (or Editors > SQL)");
  console.log('4. For table "reviews": Disable RLS');
  console.log('5. For table "bookings": Disable RLS\n');
  console.log("Alternative: Run this SQL in SQL Editor:\n");

  const sql = `
-- Disable RLS for public access (development only!)
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
  `.trim();

  console.log(sql);
  console.log("\n6. After disabling RLS, run: npm run seed-reviews\n");
}

run();
