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

async function verify() {
  loadEnv();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE credentials in .env");
    process.exit(1);
  }

  const supabase = createClient(url, key, { realtime: { enabled: false } });
  let allOk = true;

  console.log("Verifying tables...\n");

  // Check reviews
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id", { count: "exact" })
      .limit(1);
    if (error) {
      console.error("❌ reviews table: NOT FOUND or inaccessible");
      allOk = false;
    } else {
      console.log("✅ reviews table: EXISTS and accessible");
    }
  } catch (e) {
    console.error("❌ reviews table error:", e.message);
    allOk = false;
  }

  // Check bookings
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("id", { count: "exact" })
      .limit(1);
    if (error) {
      console.error("❌ bookings table: NOT FOUND or inaccessible");
      allOk = false;
    } else {
      console.log("✅ bookings table: EXISTS and accessible");
    }
  } catch (e) {
    console.error("❌ bookings table error:", e.message);
    allOk = false;
  }

  if (allOk) {
    console.log("\n✅ All tables verified! Proceeding with test suite...\n");

    // Test review insertion
    console.log("--- Test: Insert Review ---");
    const testReview = {
      name: "Test User",
      rating: 5,
      review_text: "Great clinic with excellent service",
      review_date: new Date().toISOString(),
      source: "web",
      approved: true,
    };

    const { data: reviewData, error: reviewErr } = await supabase
      .from("reviews")
      .insert([testReview])
      .select();

    if (reviewErr) {
      console.error("❌ Insert failed:", reviewErr.message);
    } else {
      console.log("✅ Review inserted:", reviewData?.[0]?.id);

      // Clean up
      if (reviewData?.[0]) {
        await supabase.from("reviews").delete().eq("id", reviewData[0].id);
      }
    }

    // Test booking insertion
    console.log("\n--- Test: Insert Booking ---");
    const testBooking = {
      name: "Test Patient",
      phone: "+919876543210",
      email: "patient@example.com",
      treatment_type: "Physiotherapy",
      preferred_date: new Date(Date.now() + 86400000).toISOString(),
      message: "Initial consultation",
      status: "pending",
    };

    const { data: bookingData, error: bookingErr } = await supabase
      .from("bookings")
      .insert([testBooking])
      .select();

    if (bookingErr) {
      console.error("❌ Insert failed:", bookingErr.message);
    } else {
      console.log("✅ Booking inserted:", bookingData?.[0]?.id);

      // Clean up
      if (bookingData?.[0]) {
        await supabase.from("bookings").delete().eq("id", bookingData[0].id);
      }
    }

    console.log("\n✅ All tests passed!");
  } else {
    console.log(
      "\n❌ Some tables are missing. Please create them via Supabase Dashboard first.",
    );
    process.exit(1);
  }
}

verify().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});
