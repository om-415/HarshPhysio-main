// Vercel serverless function to sync Google Place reviews into Supabase
const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  try {
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!PLACE_ID || !API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(400).json({ ok: false, error: "missing_env" });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(PLACE_ID)}&fields=reviews&key=${API_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    const reviews = json.result?.reviews || [];

    let added = 0;
    const results = [];
    for (const gr of reviews) {
      const google_review_id = String(
        gr.time || gr.author_url || gr.author_name,
      ).slice(0, 120);
      // check duplicate
      const { data: exists } = await supabase
        .from("reviews")
        .select("id")
        .eq("google_review_id", google_review_id)
        .limit(1);
      if (exists && exists.length) {
        results.push({ google_review_id, status: "exists" });
        continue;
      }

      const payload = {
        name: gr.author_name || "Google User",
        rating: gr.rating,
        review_text: gr.text || "",
        review_date: new Date(
          (gr.time || Date.now() / 1000) * 1000,
        ).toISOString(),
        profile_photo: gr.profile_photo_url || null,
        source: "google",
        google_review_id,
        approved: true,
      };

      const { error } = await supabase.from("reviews").insert([payload]);
      if (error) {
        results.push({
          google_review_id,
          status: "error",
          error: String(error),
        });
      } else {
        added += 1;
        results.push({ google_review_id, status: "added" });
      }
    }

    return res.json({ ok: true, added, results });
  } catch (err) {
    console.error("syncGoogleReviews error", err);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
};
