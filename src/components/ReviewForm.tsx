import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const ReviewForm = ({ onSubmitted }: { onSubmitted?: () => void }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const approved = rating >= 4; // auto-approve 4 and 5 star reviews
      const { error } = await supabase.from("reviews").insert([
        {
          name: name || "Anonymous",
          rating,
          review_text: text,
          review_date: new Date().toISOString(),
          source: "web",
          approved,
        },
      ]);
      if (error) throw error;
      setName("");
      setRating(5);
      setText("");
      onSubmitted?.();
      alert("Thanks for your review — it will appear shortly after approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Name
        </label>
        <input
          className="input-clinical"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`p-2 rounded ${n <= rating ? "bg-primary text-primary-foreground" : "bg-accent"}`}
            >
              <Star className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Review
        </label>
        <textarea
          className="input-clinical resize-none"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell us about your experience"
        />
      </div>

      <div>
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
