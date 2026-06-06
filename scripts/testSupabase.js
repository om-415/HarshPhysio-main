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
      // strip surrounding quotes
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
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE URL or ANON KEY in environment.");
    process.exit(1);
  }

  console.log("Connecting to Supabase:", url);
  const supabase = createClient(url, key, {
    realtime: { params: { eventsPerSecond: 5 } },
  });

  // Check reviews table
  try {
    console.log("\nChecking `reviews` table...");
    const { data: rdata, error: rerr } = await supabase
      .from("reviews")
      .select("*")
      .limit(1);
    if (rerr) {
      console.error("Select from reviews failed:", rerr.message || rerr);
    } else {
      console.log("`reviews` select OK. Rows returned:", (rdata || []).length);
    }
  } catch (e) {
    console.error("Error checking reviews:", e.message || e);
  }

  // Attempt realtime subscription to reviews
  let realtimeFired = false;
  try {
    console.log(
      "\nSetting up realtime subscription for inserts on `reviews`...",
    );
    const channel = supabase
      .channel("cli-tests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          console.log(
            "Realtime INSERT event received for reviews:",
            payload.new,
          );
          realtimeFired = true;
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    // Insert a test review
    console.log(
      "\nInserting a test review (will be auto-approved if rules allow)...",
    );
    const now = new Date().toISOString();
    const { data: ins, error: ierr } = await supabase
      .from("reviews")
      .insert([
        {
          name: "Automated Test",
          rating: 5,
          review_text: "Automated test review from local script",
          review_date: now,
          source: "web",
          approved: true,
        },
      ])
      .select();

    if (ierr) {
      console.error("Insert into reviews failed:", ierr.message || ierr);
    } else {
      console.log(
        "Inserted review:",
        ins && ins[0] ? ins[0].id || ins[0] : ins,
      );
    }

    // Wait up to 5s for realtime event
    await new Promise((res) => setTimeout(res, 5000));

    if (!realtimeFired)
      console.warn(
        "Realtime event did not fire (might be disabled or require different client privileges).",
      );

    // Cleanup: try deleting the test review we just created if we got an id
    try {
      const id = ins && ins[0] && ins[0].id;
      if (id) {
        await supabase.from("reviews").delete().eq("id", id);
        console.log("Cleaned up test review id=", id);
      }
    } catch (e) {
      // ignore
    }

    // Check bookings table by attempting an insert
    console.log("\nTesting `bookings` insert...");
    const booking = {
      name: "Automated Booking",
      phone: "+0000000000",
      email: "test@example.com",
      service: "Consultation",
      date: new Date().toISOString(),
      notes: "Created by test script",
    };
    const { data: bdata, error: berr } = await supabase
      .from("bookings")
      .insert([booking])
      .select();
    if (berr) {
      console.error("Insert into bookings failed:", berr.message || berr);
    } else {
      console.log(
        "Inserted booking:",
        bdata && bdata[0] ? bdata[0].id || bdata[0] : bdata,
      );
      // attempt cleanup
      try {
        const bid = bdata && bdata[0] && bdata[0].id;
        if (bid) await supabase.from("bookings").delete().eq("id", bid);
      } catch (e) {}
    }

    // unsubscribe
    try {
      await supabase.removeChannel(channel);
    } catch (e) {}
  } catch (e) {
    console.error("Realtime/test flow error:", e.message || e);
  }

  console.log("\nTest script finished.");
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
