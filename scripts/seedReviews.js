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

const sampleReviews = [
  {
    name: "Rajesh Kumar",
    rating: 5,
    review_text:
      "Excellent physiotherapy clinic! Dr. Harsh is very professional and caring. My back pain improved significantly within 3 weeks.",
    source: "web",
    approved: true,
  },
  {
    name: "Priya Singh",
    rating: 5,
    review_text:
      "Best clinic in Lucknow. The staff is friendly and the treatment is very effective. Highly recommended!",
    source: "web",
    approved: true,
  },
  {
    name: "Amit Patel",
    rating: 5,
    review_text:
      "Dr. Harsh provided excellent care during my shoulder injury recovery. Very knowledgeable and patient.",
    source: "web",
    approved: true,
  },
  {
    name: "Neha Sharma",
    rating: 4,
    review_text:
      "Great physiotherapy experience. The exercises are tailored to individual needs. Definitely coming back!",
    source: "web",
    approved: true,
  },
  {
    name: "Vikram Singh",
    rating: 5,
    review_text:
      "Outstanding service! My knee pain is completely gone. Thank you Dr. Harsh for the amazing treatment.",
    source: "web",
    approved: true,
  },
  {
    name: "Anjali Verma",
    rating: 5,
    review_text:
      "Professional staff, clean clinic, effective treatment. I felt better after the first session itself!",
    source: "web",
    approved: true,
  },
];

async function run() {
  loadEnv();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE credentials");
    process.exit(1);
  }

  const supabase = createClient(url, key, { realtime: { enabled: false } });

  console.log("Seeding sample reviews...\n");

  try {
    // First check if reviews already exist
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(
        "⚠️  Reviews already exist. Skipping seed to avoid duplicates.",
      );
      process.exit(0);
    }

    const now = new Date().toISOString();
    const reviewsToInsert = sampleReviews.map((r) => ({
      ...r,
      review_date: now,
    }));

    const { data, error } = await supabase
      .from("reviews")
      .insert(reviewsToInsert)
      .select();

    if (error) {
      console.error("❌ Failed to insert reviews:", error.message);
      console.log("\n⚠️  This likely means RLS policies are still enabled.");
      console.log("Run: npm run disable-rls\n");
      process.exit(1);
    }

    console.log(
      `✅ Successfully inserted ${data?.length || 0} sample reviews!\n`,
    );
    console.log("Sample reviews:");
    data?.forEach((r) => {
      console.log(
        `  • ${r.name} (${r.rating}★): "${r.review_text.substring(0, 50)}..."`,
      );
    });
    console.log("\nNext: npm run dev\n");
  } catch (e) {
    console.error("Error:", e.message || e);
    process.exit(1);
  }
}

run();
