import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import ReviewForm from "./ReviewForm";

type Review = {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  review_date: string;
  profile_photo?: string | null;
  source?: string;
  approved?: boolean | null;
};

// Fallback reviews if database is empty
const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    name: "Rajesh Kumar",
    rating: 5,
    review_text:
      "Excellent physiotherapy clinic! Dr. Harsh is very professional and caring. My back pain improved significantly within 3 weeks.",
    review_date: new Date().toISOString(),
    source: "web",
    approved: true,
  },
  {
    id: "fallback-2",
    name: "Priya Singh",
    rating: 5,
    review_text:
      "Best clinic in Lucknow. The staff is friendly and the treatment is very effective. Highly recommended!",
    review_date: new Date().toISOString(),
    source: "web",
    approved: true,
  },
  {
    id: "fallback-3",
    name: "Amit Patel",
    rating: 5,
    review_text:
      "Dr. Harsh provided excellent care during my shoulder injury recovery. Very knowledgeable and patient.",
    review_date: new Date().toISOString(),
    source: "web",
    approved: true,
  },
  {
    id: "fallback-4",
    name: "Neha Sharma",
    rating: 4,
    review_text:
      "Great physiotherapy experience. The exercises are tailored to individual needs. Definitely coming back!",
    review_date: new Date().toISOString(),
    source: "web",
    approved: true,
  },
  {
    id: "fallback-5",
    name: "Vikram Singh",
    rating: 5,
    review_text:
      "Outstanding service! My knee pain is completely gone. Thank you Dr. Harsh for the amazing treatment.",
    review_date: new Date().toISOString(),
    source: "web",
    approved: true,
  },
  {
    id: "fallback-6",
    name: "Anjali Verma",
    rating: 5,
    review_text:
      "Professional staff, clean clinic, effective treatment. I felt better after the first session itself!",
    review_date: new Date().toISOString(),
    source: "web",
    approved: true,
  },
];

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex-shrink-0 w-80 card-clinical flex flex-col mr-4">
    <Quote className="w-8 h-8 text-muted mb-4" strokeWidth={1.5} />
    <p className="text-foreground mb-6 flex-1 leading-relaxed text-sm">
      "{review.review_text}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
        {review.name ? review.name.charAt(0) : "A"}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">
          {review.name || "Anonymous"}
        </p>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, j) => (
            <Star
              key={j}
              className={`w-3 h-3 flex-shrink-0 ${
                j < (review.rating || 5)
                  ? "fill-primary text-primary"
                  : "text-muted"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {review.source === "google" ? "Google" : "Website"}
        </div>
      </div>
    </div>
  </div>
);

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("review_date", { ascending: false })
        .limit(12);
      if (error) throw error;

      const fetchedReviews = (data as Review[]) || [];
      if (fetchedReviews.length > 0) {
        setReviews(fetchedReviews);
        setIsUsingFallback(false);
        console.log(`✅ Loaded ${fetchedReviews.length} reviews from Supabase`);
      } else {
        console.log("📭 No reviews in database, using fallback");
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          const newReview = payload.new as Review;
          // Only show if approved
          if (newReview.approved) {
            setReviews((r) => [newReview, ...r].slice(0, 12));
            setIsUsingFallback(false);
            console.log("🔔 New review received via realtime");
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const approvedReviews = reviews.filter((r) => r.approved !== false);
  const avg = approvedReviews.length
    ? (
        approvedReviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
        approvedReviews.length
      ).toFixed(1)
    : "0.0";

  // Split reviews into two groups for alternating marquee rows
  const row1Reviews = reviews.filter((_, i) => i % 2 === 0);
  const row2Reviews = reviews.filter((_, i) => i % 2 === 1);

  return (
    <section id="reviews" className="section-padding bg-muted/50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
            Patient Reviews
          </p>
          <h2 className="heading-section text-foreground mb-2">
            What Our Patients Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(Number(avg))
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground">
            {avg} out of 5 · Based on {reviews.length} verified reviews
            {isUsingFallback && " (Sample reviews)"}
          </p>
        </motion.div>

        {/* Marquee Rows */}
        <div className="space-y-6 mb-12">
          {/* Row 1: Right → Left */}
          <style>{`
            @keyframes marquee-rtl {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-ltr {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .marquee-rtl {
              animation: marquee-rtl 30s linear infinite;
            }
            .marquee-ltr {
              animation: marquee-ltr 30s linear infinite;
            }
            .marquee-container:hover .marquee-rtl,
            .marquee-container:hover .marquee-ltr {
              animation-play-state: paused;
            }
          `}</style>

          {/* Row 1: Scrolls right to left */}
          <div className="marquee-container overflow-hidden bg-gradient-to-r from-background via-transparent to-background rounded-lg">
            <div className="marquee-rtl flex">
              {[...row1Reviews, ...row1Reviews].map((review, idx) => (
                <ReviewCard key={`${review.id}-${idx}`} review={review} />
              ))}
            </div>
          </div>

          {/* Row 2: Scrolls left to right */}
          <div className="marquee-container overflow-hidden bg-gradient-to-r from-background via-transparent to-background rounded-lg">
            <div className="marquee-ltr flex" style={{ marginLeft: "0" }}>
              {[...row2Reviews, ...row2Reviews].map((review, idx) => (
                <ReviewCard key={`${review.id}-${idx}`} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* Fallback Notice */}
        {isUsingFallback && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 text-center">
            <p className="text-sm text-muted-foreground">
              📝 Sample reviews shown • Submit your review below to see it live!
            </p>
          </div>
        )}

        {/* Review Form & Google Link */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card-clinical">
            <h3 className="heading-sub mb-3">Leave A Review</h3>
            <ReviewForm
              onSubmitted={() => {
                /* handled by realtime */
              }}
            />
          </div>

          <div className="card-clinical">
            <h3 className="heading-sub mb-3">Review Us On Google</h3>
            <p className="text-muted-foreground mb-4">
              Your Google review helps other patients find trusted care. Tap
              below to leave a review on Google.
            </p>
            <a
              href="https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
            >
              Leave a Google Review
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
