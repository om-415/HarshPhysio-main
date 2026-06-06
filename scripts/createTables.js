import fs from "fs";
import path from "path";

function loadEnv(envPath = ".env") {
  const txt = fs.readFileSync(envPath, "utf8");
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

async function createTables() {
  loadEnv();
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    console.error("SUPABASE_URL not set in .env");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.warn("\n⚠️  No SUPABASE_SERVICE_ROLE_KEY provided.");
    console.log(
      "\n📋 To create tables, please run the following SQL manually in the Supabase Dashboard:",
    );
    console.log("   1. Go to: https://supabase.com/dashboard");
    console.log("   2. Select your project");
    console.log("   3. Navigate to SQL Editor");
    console.log("   4. Create a new query and paste the following SQL:\n");

    const reviewsSql = fs.readFileSync(
      "supabase/migrations/create_reviews.sql",
      "utf8",
    );
    const bookingsSql = fs.readFileSync(
      "supabase/migrations/create_bookings.sql",
      "utf8",
    );

    console.log("--- REVIEWS TABLE SQL ---");
    console.log(reviewsSql);
    console.log("\n--- BOOKINGS TABLE SQL ---");
    console.log(bookingsSql);
    console.log("\n--- END SQL ---\n");
    console.log('5. Click "Run" to execute both migrations.');
    console.log("6. Then run: npm run verify-tables\n");
    return;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    console.log("Attempting to create tables using service role key...");

    // For now, we cannot run raw SQL via the JS client. We need to use the management API.
    console.log("\n❌ The JS client does not support raw SQL execution.");
    console.log("⚠️  To run migrations, please use one of these approaches:\n");
    console.log("Option 1: Use Supabase CLI");
    console.log("   Install: npm install -g supabase");
    console.log("   Link: supabase link --project-ref yksghxmsncgxfbfrqnbw");
    console.log("   Push: supabase db push");
    console.log("\nOption 2: Manual SQL in Supabase Dashboard");
    console.log("   See instructions above.\n");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

createTables();
